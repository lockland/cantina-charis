package models

import "github.com/shopspring/decimal"

// Orders is a named slice so we can attach aggregate behaviour (Go does not allow methods on []T directly).
type Orders []Order

// Residual on a single order returns max(0, OrderAmount - PaidValue).
func (o *Order) Residual() decimal.Decimal {
	if o == nil {
		return decimal.Zero
	}
	zero := decimal.Zero
	paid := o.PaidValue
	if paid.GreaterThan(o.OrderAmount) {
		paid = o.OrderAmount
	}
	r := o.OrderAmount.Sub(paid)
	if r.LessThan(zero) {
		return zero
	}
	return r
}

// ResidualValue returns the sum of each order's Residual() (total open amount on this set).
func (o Orders) ResidualValue() decimal.Decimal {
	sum := decimal.Zero
	for i := range o {
		sum = sum.Add(o[i].Residual())
	}
	return sum
}

// ApplyPaymentValue splits payment FIFO across orders in place (each up to its remaining balance).
// Negative payment is a no-op.
func (o Orders) ApplyPaymentValue(payment decimal.Decimal) {
	if len(o) == 0 {
		return
	}
	zero := decimal.Zero
	if payment.LessThan(zero) {
		return
	}
	remaining := payment
	for i := range o {
		remaining = applyPaymentToOrder(&o[i], remaining)
	}
}

// applyPaymentToOrder applies as much of remaining as fits on ord's unpaid balance; returns unallocated payment.
func applyPaymentToOrder(ord *Order, remaining decimal.Decimal) decimal.Decimal {
	zero := decimal.Zero
	currentPaid := ord.PaidValue
	if currentPaid.GreaterThan(ord.OrderAmount) {
		currentPaid = ord.OrderAmount
	}
	residual := ord.OrderAmount.Sub(currentPaid)
	if residual.LessThanOrEqual(zero) {
		return remaining
	}
	alloc := remaining
	if alloc.GreaterThan(residual) {
		alloc = residual
	}
	ord.PaidValue = ord.PaidValue.Add(alloc)
	return remaining.Sub(alloc)
}
