package repository

import (
	"errors"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// DebitRepository loads customers with open debits and applies bulk payments.
type DebitRepository struct {
	db *gorm.DB
}

// NewDebitRepository builds a repository bound to db.
func NewDebitRepository(db *gorm.DB) *DebitRepository {
	return &DebitRepository{db: db}
}

// ListCustomersWithOpenOrders returns customers that have at least one unpaid order, with orders preloaded.
func (r *DebitRepository) ListCustomersWithOpenOrders(customers *[]models.Customer) error {
	return r.db.Model(&models.Customer{}).
		Joins(`INNER JOIN orders ON orders.customer_id = customers.id AND CAST(orders.paid_value AS REAL) < CAST(orders.order_amount AS REAL)`).
		Distinct().
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
		Find(customers).Error
}

func updateOrderPaidIfAllocated(tx *gorm.DB, ord *models.Order, zero decimal.Decimal) error {
	if ord.PaidValue.Equal(zero) {
		return nil
	}
	return tx.Model(&models.Order{ID: ord.ID}).Update("paid_value", ord.PaidValue).Error
}

// PayCustomerDebits loads open orders, applies payment in memory, persists paid_value in one transaction.
// Returns ErrDebitCustomerNotFound, ErrDebitNoOutstandingWithPayment, or other DB errors.
func (r *DebitRepository) PayCustomerDebits(customerID int, payment decimal.Decimal) (*models.Customer, error) {
	zero := decimal.NewFromInt(0)
	customer := &models.Customer{ID: customerID}

	tx := r.db.Begin()
	err := tx.
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
		First(customer, customerID).Error
	if err != nil {
		tx.Rollback()
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, ErrDebitCustomerNotFound
		}
		return nil, err
	}

	if len(customer.Orders) == 0 && payment.GreaterThan(zero) {
		tx.Rollback()
		return nil, ErrDebitNoOutstandingWithPayment
	}

	customer.Orders.ApplyPaymentValue(payment)
	for i := range customer.Orders {
		err = updateOrderPaidIfAllocated(tx, &customer.Orders[i], zero)
		if err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	err = tx.Commit().Error
	if err != nil {
		return nil, err
	}
	return customer, nil
}
