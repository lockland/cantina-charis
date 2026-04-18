package models_test

import (
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
)

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}

func TestOrderResidual(t *testing.T) {

	t.Run("nil order returns zero", func(t *testing.T) {
		assert.True(t, ((*models.Order)(nil)).Residual().Equal(decimal.Zero))
	})

	t.Run("fully paid returns zero", func(t *testing.T) {
		o := &models.Order{
			OrderAmount: decimal.RequireFromString("100"),
			PaidValue:   decimal.RequireFromString("100"),
		}
		assert.True(t, o.Residual().Equal(decimal.Zero))
	})

	t.Run("partial payment returns remainder", func(t *testing.T) {
		o := &models.Order{
			OrderAmount: decimal.RequireFromString("100"),
			PaidValue:   decimal.RequireFromString("35.5"),
		}
		want := decimal.RequireFromString("64.5")
		assert.True(t, o.Residual().Equal(want))
	})

	t.Run("overpaid returns zero", func(t *testing.T) {
		o := &models.Order{
			OrderAmount: decimal.RequireFromString("100"),
			PaidValue:   decimal.RequireFromString("120"),
		}
		assert.True(t, o.Residual().Equal(decimal.Zero))
	})
}

func TestOrdersResidualValue(t *testing.T) {

	t.Run("nil slice returns zero", func(t *testing.T) {
		assert.True(t, (models.Orders(nil)).ResidualValue().Equal(decimal.Zero))
	})

	t.Run("empty slice returns zero", func(t *testing.T) {
		assert.True(t, (models.Orders{}).ResidualValue().Equal(decimal.Zero))
	})

	t.Run("sums per-order residual", func(t *testing.T) {
		orders := models.Orders{
			{OrderAmount: dec("50"), PaidValue: dec("0")},
			{OrderAmount: dec("30"), PaidValue: dec("10")},
		}
		want := dec("50").Add(dec("20"))
		assert.True(t, orders.ResidualValue().Equal(want))
	})
}

func TestOrdersApplyPaymentValue(t *testing.T) {

	t.Run("nil orders is no-op", func(t *testing.T) {
		assert.NotPanics(t, func() {
			(models.Orders(nil)).ApplyPaymentValue(dec("10"))
		})
	})

	t.Run("empty orders is no-op", func(t *testing.T) {
		orders := models.Orders{}
		orders.ApplyPaymentValue(dec("10"))
		assert.Len(t, orders, 0)
	})

	t.Run("zero payment leaves paid unchanged", func(t *testing.T) {
		orders := models.Orders{{OrderAmount: dec("100"), PaidValue: dec("0")}}
		orders.ApplyPaymentValue(decimal.Zero)
		assert.True(t, orders[0].PaidValue.Equal(decimal.Zero))
	})

	t.Run("partial on unpaid order", func(t *testing.T) {
		orders := models.Orders{{OrderAmount: dec("100"), PaidValue: dec("0")}}
		orders.ApplyPaymentValue(dec("30"))
		assert.True(t, orders[0].PaidValue.Equal(dec("30")))
	})

	t.Run("adds to existing partial pay", func(t *testing.T) {
		orders := models.Orders{{OrderAmount: dec("100"), PaidValue: dec("60")}}
		orders.ApplyPaymentValue(dec("25"))
		assert.True(t, orders[0].PaidValue.Equal(dec("85")))
	})

	t.Run("payment exceeding single order residual caps at order amount", func(t *testing.T) {
		orders := models.Orders{{OrderAmount: dec("100"), PaidValue: dec("60")}}
		orders.ApplyPaymentValue(dec("50"))
		assert.True(t, orders[0].PaidValue.Equal(dec("100")))
	})

	t.Run("FIFO across two orders", func(t *testing.T) {
		orders := models.Orders{
			{OrderAmount: dec("50"), PaidValue: dec("0")},
			{OrderAmount: dec("50"), PaidValue: dec("0")},
		}
		orders.ApplyPaymentValue(dec("60"))
		assert.True(t, orders[0].PaidValue.Equal(dec("50")))
		assert.True(t, orders[1].PaidValue.Equal(dec("10")))
	})

	t.Run("exact total pays both orders", func(t *testing.T) {
		orders := models.Orders{
			{OrderAmount: dec("40"), PaidValue: dec("0")},
			{OrderAmount: dec("60"), PaidValue: dec("10")},
		}
		orders.ApplyPaymentValue(dec("90"))
		assert.True(t, orders[0].PaidValue.Equal(dec("40")))
		assert.True(t, orders[1].PaidValue.Equal(dec("60")))
	})

	t.Run("negative payment is no-op", func(t *testing.T) {
		orders := models.Orders{{OrderAmount: dec("100"), PaidValue: dec("40")}}
		orders.ApplyPaymentValue(dec("-5"))
		assert.True(t, orders[0].PaidValue.Equal(dec("40")))
	})
}
