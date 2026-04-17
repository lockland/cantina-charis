package service

import "errors"

var (
	// ErrDebitCustomerNotFound is returned when no customer row exists for the id.
	ErrDebitCustomerNotFound = errors.New("customer not found")
	// ErrDebitNoOutstandingWithPayment is returned when payment is positive but the customer has no open orders.
	ErrDebitNoOutstandingWithPayment = errors.New("no outstanding orders for this customer")
)
