package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// DebitRepository lists customers with open debits and exposes transactional persistence helpers.
type DebitRepository struct {
	db *gorm.DB
}

// NewDebitRepository builds a repository bound to db.
func NewDebitRepository(db *gorm.DB) *DebitRepository {
	return &DebitRepository{db: db}
}

// Transaction runs fn inside a DB transaction (begin/commit or rollback on error).
func (r *DebitRepository) Transaction(fn func(tx *gorm.DB) error) error {
	return r.db.Transaction(fn)
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

// FindCustomerWithOpenOrdersForPayTx loads one customer with unpaid orders preloaded, using tx.
func (r *DebitRepository) FindCustomerWithOpenOrdersForPayTx(tx *gorm.DB, customerID int) (*models.Customer, error) {
	customer := &models.Customer{ID: customerID}
	err := tx.
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
		First(customer, customerID).Error
	if err != nil {
		return nil, err
	}
	return customer, nil
}

// UpdateOrderPaidValueTx persists paid_value for one order within tx.
func (r *DebitRepository) UpdateOrderPaidValueTx(tx *gorm.DB, orderID int, paidValue decimal.Decimal) error {
	return tx.Model(&models.Order{ID: orderID}).Update("paid_value", paidValue).Error
}
