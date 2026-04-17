package debits

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

// ApplyBulkPayment applies payment in order (FIFO over the slice): each order receives
// up to its remaining balance; payment is reduced until exhausted.
// Returns new PaidValue per index; negative payment yields a copy of current paid values (no-op).
func ApplyBulkPayment(orders []models.Order, payment decimal.Decimal) []decimal.Decimal {
	out := make([]decimal.Decimal, len(orders))
	if len(orders) == 0 {
		return out
	}
	zero := decimal.Zero
	if payment.LessThan(zero) {
		for i := range orders {
			out[i] = orders[i].PaidValue
		}
		return out
	}
	remaining := payment
	for i, o := range orders {
		currentPaid := o.PaidValue
		if currentPaid.GreaterThan(o.OrderAmount) {
			currentPaid = o.OrderAmount
		}
		residual := o.OrderAmount.Sub(currentPaid)
		if residual.LessThanOrEqual(zero) {
			out[i] = o.PaidValue
			continue
		}
		alloc := remaining
		if alloc.GreaterThan(residual) {
			alloc = residual
		}
		out[i] = o.PaidValue.Add(alloc)
		remaining = remaining.Sub(alloc)
	}
	return out
}
