package service

import (
	"errors"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// DebitService holds debit payment rules; persistence and transaction boundaries live in the embedded repository.
type DebitService struct {
	*repository.DebitRepository
}

// NewDebitService builds a service backed by the given repository.
func NewDebitService(repo *repository.DebitRepository) *DebitService {
	return &DebitService{DebitRepository: repo}
}

// PayCustomerDebits applies FIFO payment to open orders inside a repository-managed transaction.
func (s *DebitService) PayCustomerDebits(customerID int, payment decimal.Decimal) (*models.Customer, error) {
	zero := decimal.NewFromInt(0)
	var result *models.Customer
	err := s.Transaction(func(tx *gorm.DB) error {
		var err error
		result, err = s.payCustomerDebitsTx(tx, customerID, payment, zero)
		return err
	})
	return result, err
}

func mapFindCustomerPayErr(err error) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return ErrDebitCustomerNotFound
	}
	return err
}

func (s *DebitService) payCustomerDebitsTx(tx *gorm.DB, customerID int, payment, zero decimal.Decimal) (*models.Customer, error) {
	customer, err := s.FindCustomerWithOpenOrdersForPayTx(tx, customerID)
	if err != nil {
		return nil, mapFindCustomerPayErr(err)
	}
	if len(customer.Orders) == 0 && payment.GreaterThan(zero) {
		return nil, ErrDebitNoOutstandingWithPayment
	}
	customer.Orders.ApplyPaymentValue(payment)
	if err := s.persistOrdersPaidTx(tx, customer.Orders, zero); err != nil {
		return nil, err
	}
	return customer, nil
}

func (s *DebitService) persistOrdersPaidTx(tx *gorm.DB, orders models.Orders, zero decimal.Decimal) error {
	for i := range orders {
		if err := s.persistOneOrderPaidTx(tx, &orders[i], zero); err != nil {
			return err
		}
	}
	return nil
}

func (s *DebitService) persistOneOrderPaidTx(tx *gorm.DB, ord *models.Order, zero decimal.Decimal) error {
	if ord.PaidValue.Equal(zero) {
		return nil
	}
	return s.UpdateOrderPaidValueTx(tx, ord.ID, ord.PaidValue)
}
