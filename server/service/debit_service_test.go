package service

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}

func TestPayCustomerDebits_customerNotFound(t *testing.T) {
	db := testutil.OpenSQLite(t)
	repo := repository.NewDebitRepository(db)
	svc := NewDebitService(repo)

	_, err := svc.PayCustomerDebits(999, decimal.NewFromInt(10))
	assert.ErrorIs(t, err, ErrDebitCustomerNotFound)
}

func TestPayCustomerDebits_noOutstandingOrdersWithPayment(t *testing.T) {
	db := testutil.OpenSQLite(t)
	c := models.Customer{Name: "Solo"}
	require.NoError(t, db.Create(&c).Error)

	svc := NewDebitService(repository.NewDebitRepository(db))
	_, err := svc.PayCustomerDebits(c.ID, decimal.NewFromInt(1))
	assert.ErrorIs(t, err, ErrDebitNoOutstandingWithPayment)
}

func TestPayCustomerDebits_paymentZero_commitsWithoutUpdatingOrders(t *testing.T) {
	db := testutil.OpenSQLite(t)
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

	svc := NewDebitService(repository.NewDebitRepository(db))
	out, err := svc.PayCustomerDebits(c.ID, decimal.Zero)
	require.NoError(t, err)
	require.NotNil(t, out)

	var reload models.Order
	require.NoError(t, db.First(&reload, o.ID).Error)
	assert.True(t, reload.PaidValue.Equal(dec("10")))
}

func TestPayCustomerDebits_fifoAndSkipsZeroPaidPersist(t *testing.T) {
	db := testutil.OpenSQLite(t)
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

	svc := NewDebitService(repository.NewDebitRepository(db))
	_, err := svc.PayCustomerDebits(c.ID, dec("30"))
	require.NoError(t, err)

	var got1, got2 models.Order
	require.NoError(t, db.First(&got1, o1.ID).Error)
	require.NoError(t, db.First(&got2, o2.ID).Error)
	assert.True(t, got1.PaidValue.Equal(dec("30")))
	assert.True(t, got2.PaidValue.Equal(dec("0")))
}

func TestDebitService_ListCustomersWithOpenOrders_delegatesToRepo(t *testing.T) {
	db := testutil.OpenSQLite(t)
	ev := models.Event{Name: "EvL", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	c := models.Customer{Name: "Owes"}
	require.NoError(t, db.Create(&c).Error)
	require.NoError(t, db.Create(&models.Order{
		CustomerID:  c.ID,
		EventID:     ev.ID,
		OrderAmount: dec("10"),
		PaidValue:   dec("0"),
	}).Error)

	svc := NewDebitService(repository.NewDebitRepository(db))
	var customers []models.Customer
	require.NoError(t, svc.ListCustomersWithOpenOrders(&customers))
	require.Len(t, customers, 1)
	assert.Equal(t, c.ID, customers[0].ID)
}
