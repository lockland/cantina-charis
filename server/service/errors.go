package service

import "errors"

var (
	// ErrDebitCustomerNotFound is returned when no customer row exists for the id.
	ErrDebitCustomerNotFound = errors.New("customer not found")
	// ErrDebitNoOutstandingWithPayment is returned when payment is positive but the customer has no open orders.
	ErrDebitNoOutstandingWithPayment = errors.New("no outstanding orders for this customer")
	// ErrOrderAlreadyFullyPaid is returned when a full payment is requested but paid_value already covers order_amount.
	ErrOrderAlreadyFullyPaid = errors.New("order already fully paid")
)
