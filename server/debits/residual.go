package debits

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

// OrderResidual returns max(0, OrderAmount - PaidValue) for a single order.
func OrderResidual(o *models.Order) decimal.Decimal {
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

// TotalResidual sums OrderResidual for each order in the slice.
func TotalResidual(orders []models.Order) decimal.Decimal {
	sum := decimal.Zero
	for i := range orders {
		sum = sum.Add(OrderResidual(&orders[i]))
	}
	return sum
}
