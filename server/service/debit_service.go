package service

import (
	"errors"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// DebitService applies debit payment rules and delegates read queries to the repository.
type DebitService struct {
	db   *gorm.DB
	repo *repository.DebitRepository
}

// NewDebitService builds a service with shared db (same handle as repository queries).
func NewDebitService(db *gorm.DB) *DebitService {
	return &DebitService{
		db:   db,
		repo: repository.NewDebitRepository(db),
	}
}

// ListCustomersWithOpenOrders delegates to the repository.
func (s *DebitService) ListCustomersWithOpenOrders(customers *[]models.Customer) error {
	return s.repo.ListCustomersWithOpenOrders(customers)
}

func updateOrderPaidIfAllocated(tx *gorm.DB, ord *models.Order, zero decimal.Decimal) error {
	if ord.PaidValue.Equal(zero) {
		return nil
	}
	return tx.Model(&models.Order{ID: ord.ID}).Update("paid_value", ord.PaidValue).Error
}

// PayCustomerDebits loads open orders, applies payment in memory, persists paid_value in one transaction.
func (s *DebitService) PayCustomerDebits(customerID int, payment decimal.Decimal) (*models.Customer, error) {
	zero := decimal.NewFromInt(0)
	var customer *models.Customer

	err := s.db.Transaction(func(tx *gorm.DB) error {
		customer = &models.Customer{ID: customerID}
		err := tx.
			Preload("Orders", func(db *gorm.DB) *gorm.DB {
				return db.Order("created_at asc").
					Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
			}).
			Preload("Orders.Event").
			First(customer, customerID).Error
		if err != nil {
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return ErrDebitCustomerNotFound
			}
			return err
		}

		if len(customer.Orders) == 0 && payment.GreaterThan(zero) {
			return ErrDebitNoOutstandingWithPayment
		}

		customer.Orders.ApplyPaymentValue(payment)
		for i := range customer.Orders {
			err = updateOrderPaidIfAllocated(tx, &customer.Orders[i], zero)
			if err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	return customer, nil
}
