package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}

func TestListCustomersWithOpenOrders_onlyCustomersWithResidual(t *testing.T) {
	db := testutil.OpenSQLite(t)
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
