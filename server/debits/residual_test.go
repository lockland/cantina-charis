package debits

import (
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

func TestOrderResidual_nil(t *testing.T) {
	if !OrderResidual(nil).Equal(decimal.Zero) {
		t.Fatal("expected zero for nil order")
	}
}

func TestOrderResidual_fullyPaid(t *testing.T) {
	o := &models.Order{
		OrderAmount: decimal.RequireFromString("100"),
		PaidValue:   decimal.RequireFromString("100"),
	}
	if !OrderResidual(o).Equal(decimal.Zero) {
		t.Fatalf("got %s", OrderResidual(o).String())
	}
}

func TestOrderResidual_partial(t *testing.T) {
	o := &models.Order{
		OrderAmount: decimal.RequireFromString("100"),
		PaidValue:   decimal.RequireFromString("35.5"),
	}
	want := decimal.RequireFromString("64.5")
	if !OrderResidual(o).Equal(want) {
		t.Fatalf("got %s want %s", OrderResidual(o).String(), want.String())
	}
}

func TestOrderResidual_overpaid(t *testing.T) {
	o := &models.Order{
		OrderAmount: decimal.RequireFromString("100"),
		PaidValue:   decimal.RequireFromString("120"),
	}
	if !OrderResidual(o).Equal(decimal.Zero) {
		t.Fatalf("got %s", OrderResidual(o).String())
	}
}

func TestTotalResidual_empty(t *testing.T) {
	if !TotalResidual(nil).Equal(decimal.Zero) {
		t.Fatal("expected zero")
	}
	if !TotalResidual([]models.Order{}).Equal(decimal.Zero) {
		t.Fatal("expected zero")
	}
}

func TestTotalResidual_sum(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("50"), PaidValue: dec("0")},
		{OrderAmount: dec("30"), PaidValue: dec("10")},
	}
	want := dec("50").Add(dec("20"))
	if !TotalResidual(orders).Equal(want) {
		t.Fatalf("got %s want %s", TotalResidual(orders).String(), want.String())
	}
}

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}
