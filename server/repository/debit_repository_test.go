package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}

func TestPayCustomerDebits_customerNotFound(t *testing.T) {
	db := openTestDB(t)
	r := NewDebitRepository(db)

	_, err := r.PayCustomerDebits(999, decimal.NewFromInt(10))
	assert.ErrorIs(t, err, ErrDebitCustomerNotFound)
}

func TestPayCustomerDebits_noOutstandingOrdersWithPayment(t *testing.T) {
	db := openTestDB(t)
	c := models.Customer{Name: "Solo"}
	require.NoError(t, db.Create(&c).Error)

	r := NewDebitRepository(db)
	_, err := r.PayCustomerDebits(c.ID, decimal.NewFromInt(1))
	assert.ErrorIs(t, err, ErrDebitNoOutstandingWithPayment)
}

func TestPayCustomerDebits_paymentZero_commitsWithoutUpdatingOrders(t *testing.T) {
	db := openTestDB(t)
	ev := models.Event{Name: "Ev", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	c := models.Customer{Name: "Bob"}
	require.NoError(t, db.Create(&c).Error)
	o := models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("50"),
		PaidValue:   dec("10"),
	}
	require.NoError(t, db.Create(&o).Error)

	r := NewDebitRepository(db)
	out, err := r.PayCustomerDebits(c.ID, decimal.Zero)
	require.NoError(t, err)
	require.NotNil(t, out)

	var reload models.Order
	require.NoError(t, db.First(&reload, o.ID).Error)
	assert.True(t, reload.PaidValue.Equal(dec("10")))
}

func TestPayCustomerDebits_fifoAndSkipsZeroPaidPersist(t *testing.T) {
	db := openTestDB(t)
	ev := models.Event{Name: "Ev2", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	c := models.Customer{Name: "Carol"}
	require.NoError(t, db.Create(&c).Error)
	o1 := models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("80"),
		PaidValue:   dec("0"),
	}
	o2 := models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("40"),
		PaidValue:   dec("0"),
	}
	require.NoError(t, db.Create(&o1).Error)
	require.NoError(t, db.Create(&o2).Error)

	r := NewDebitRepository(db)
	_, err := r.PayCustomerDebits(c.ID, dec("30"))
	require.NoError(t, err)

	var got1, got2 models.Order
	require.NoError(t, db.First(&got1, o1.ID).Error)
	require.NoError(t, db.First(&got2, o2.ID).Error)
	assert.True(t, got1.PaidValue.Equal(dec("30")))
	assert.True(t, got2.PaidValue.Equal(dec("0")))
}

func TestListCustomersWithOpenOrders_onlyCustomersWithResidual(t *testing.T) {
	db := openTestDB(t)
	ev := models.Event{Name: "Ev3", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	paid := models.Customer{Name: "PaidUp"}
	open := models.Customer{Name: "StillOwes"}
	require.NoError(t, db.Create(&paid).Error)
	require.NoError(t, db.Create(&open).Error)
	require.NoError(t, db.Create(&models.Order{
		CustomerID:  paid.ID,
		EventID:     ev.ID,
		OrderAmount: dec("20"),
		PaidValue:   dec("20"),
	}).Error)
	require.NoError(t, db.Create(&models.Order{
		CustomerID:  open.ID,
		EventID:     ev.ID,
		OrderAmount: dec("20"),
		PaidValue:   dec("5"),
	}).Error)

	r := NewDebitRepository(db)
	var customers []models.Customer
	require.NoError(t, r.ListCustomersWithOpenOrders(&customers))
	require.Len(t, customers, 1)
	assert.Equal(t, open.ID, customers[0].ID)
	assert.Len(t, customers[0].Orders, 1)
}

func TestUpdateOrderPaidIfAllocated_skipsZero(t *testing.T) {
	db := openTestDB(t)
	tx := db.Begin()
	ev := models.Event{Name: "Ev4", Open: true}
	require.NoError(t, tx.Create(&ev).Error)
	c := models.Customer{Name: "Dana"}
	require.NoError(t, tx.Create(&c).Error)
	o := models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("10"),
		PaidValue:   dec("0"),
	}
	require.NoError(t, tx.Create(&o).Error)

	zero := decimal.Zero
	ord := models.Order{ID: o.ID, PaidValue: zero}
	require.NoError(t, updateOrderPaidIfAllocated(tx, &ord, zero))
	require.NoError(t, tx.Commit().Error)

	var reload models.Order
	require.NoError(t, db.First(&reload, o.ID).Error)
	assert.True(t, reload.PaidValue.Equal(zero))
}

func TestUpdateOrderPaidIfAllocated_persistsNonZero(t *testing.T) {
	db := openTestDB(t)
	tx := db.Begin()
	ev := models.Event{Name: "Ev5", Open: true}
	require.NoError(t, tx.Create(&ev).Error)
	c := models.Customer{Name: "Eve"}
	require.NoError(t, tx.Create(&c).Error)
	o := models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("10"),
		PaidValue:   dec("0"),
	}
	require.NoError(t, tx.Create(&o).Error)

	zero := decimal.Zero
	ord := models.Order{ID: o.ID, PaidValue: dec("4")}
	require.NoError(t, updateOrderPaidIfAllocated(tx, &ord, zero))
	require.NoError(t, tx.Commit().Error)

	var reload models.Order
	require.NoError(t, db.First(&reload, o.ID).Error)
	assert.True(t, reload.PaidValue.Equal(dec("4")))
}
