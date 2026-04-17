package debits

import (
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

func TestApplyBulkPayment_emptyOrders(t *testing.T) {
	out := ApplyBulkPayment(nil, dec("10"))
	if len(out) != 0 {
		t.Fatal("expected empty slice")
	}
	out = ApplyBulkPayment([]models.Order{}, dec("10"))
	if len(out) != 0 {
		t.Fatal("expected empty slice")
	}
}

func TestApplyBulkPayment_zeroPayment(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("100"), PaidValue: dec("0")},
	}
	out := ApplyBulkPayment(orders, decimal.Zero)
	if !out[0].Equal(decimal.Zero) {
		t.Fatalf("got %s", out[0].String())
	}
}

func TestApplyBulkPayment_partialFirstOrder(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("100"), PaidValue: dec("0")},
	}
	out := ApplyBulkPayment(orders, dec("30"))
	if !out[0].Equal(dec("30")) {
		t.Fatalf("got %s", out[0].String())
	}
}

func TestApplyBulkPayment_addsToExistingPartial(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("100"), PaidValue: dec("60")},
	}
	out := ApplyBulkPayment(orders, dec("25"))
	if !out[0].Equal(dec("85")) {
		t.Fatalf("got %s want 85", out[0].String())
	}
}

func TestApplyBulkPayment_exceedsResidualSingleOrder(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("100"), PaidValue: dec("60")},
	}
	out := ApplyBulkPayment(orders, dec("50"))
	if !out[0].Equal(dec("100")) {
		t.Fatalf("got %s want 100", out[0].String())
	}
}

func TestApplyBulkPayment_twoOrdersFIFO(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("50"), PaidValue: dec("0")},
		{OrderAmount: dec("50"), PaidValue: dec("0")},
	}
	out := ApplyBulkPayment(orders, dec("60"))
	if !out[0].Equal(dec("50")) {
		t.Fatalf("order0 got %s want 50", out[0].String())
	}
	if !out[1].Equal(dec("10")) {
		t.Fatalf("order1 got %s want 10", out[1].String())
	}
}

func TestApplyBulkPayment_twoOrdersExactTotal(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("40"), PaidValue: dec("0")},
		{OrderAmount: dec("60"), PaidValue: dec("10")},
	}
	out := ApplyBulkPayment(orders, dec("90"))
	if !out[0].Equal(dec("40")) {
		t.Fatalf("order0 got %s", out[0].String())
	}
	if !out[1].Equal(dec("60")) {
		t.Fatalf("order1 got %s want 60", out[1].String())
	}
}

func TestApplyBulkPayment_negativeNoOp(t *testing.T) {
	orders := []models.Order{
		{OrderAmount: dec("100"), PaidValue: dec("40")},
	}
	out := ApplyBulkPayment(orders, dec("-5"))
	if !out[0].Equal(dec("40")) {
		t.Fatalf("got %s", out[0].String())
	}
}
