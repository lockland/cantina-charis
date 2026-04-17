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

// Residual on this slice returns the sum of each order's Residual() (total open amount).
func (o Orders) Residual() decimal.Decimal {
	sum := decimal.Zero
	for i := range o {
		sum = sum.Add(o[i].Residual())
	}
	return sum
}

// ApplyPaymentValue splits payment FIFO across orders (each up to its remaining balance).
// Returns new PaidValue per index; negative payment yields a copy of current paid values (no-op).
func (o Orders) ApplyPaymentValue(payment decimal.Decimal) []decimal.Decimal {
	out := make([]decimal.Decimal, len(o))
	if len(o) == 0 {
		return out
	}
	zero := decimal.Zero
	if payment.LessThan(zero) {
		for i := range o {
			out[i] = o[i].PaidValue
		}
		return out
	}
	remaining := payment
	for i, ord := range o {
		currentPaid := ord.PaidValue
		if currentPaid.GreaterThan(ord.OrderAmount) {
			currentPaid = ord.OrderAmount
		}
		residual := ord.OrderAmount.Sub(currentPaid)
		if residual.LessThanOrEqual(zero) {
			out[i] = ord.PaidValue
			continue
		}
		alloc := remaining
		if alloc.GreaterThan(residual) {
			alloc = residual
		}
		out[i] = ord.PaidValue.Add(alloc)
		remaining = remaining.Sub(alloc)
	}
	return out
}
