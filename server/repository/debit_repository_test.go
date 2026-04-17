package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func dec(s string) decimal.Decimal {
	return decimal.RequireFromString(s)
}

func TestDebitRepository_ListCustomersWithOpenOrders(t *testing.T) {
	t.Run("given two customers when only one has residual then returns that customer only", func(t *testing.T) {
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
	})
}

func TestDebitRepository_Transaction(t *testing.T) {
	t.Run("given callback when transaction succeeds then callback ran", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		r := NewDebitRepository(db)
		var ran bool
		err := r.Transaction(func(tx *gorm.DB) error {
			ran = true
			return nil
		})
		require.NoError(t, err)
		assert.True(t, ran)
	})
}

func TestDebitRepository_FindCustomerWithOpenOrdersForPayTx(t *testing.T) {
	t.Run("given open order when updating paid inside transaction then persisted", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "Ev5", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "Eve"}
		require.NoError(t, db.Create(&c).Error)
		o := models.Order{
			CustomerID:  c.ID,
			EventID:     ev.ID,
			OrderAmount: dec("10"),
			PaidValue:   dec("0"),
		}
		require.NoError(t, db.Create(&o).Error)
		r := NewDebitRepository(db)
		err := r.Transaction(func(tx *gorm.DB) error {
			got, err := r.FindCustomerWithOpenOrdersForPayTx(tx, c.ID)
			require.NoError(t, err)
			require.Len(t, got.Orders, 1)
			return r.UpdateOrderPaidValueTx(tx, o.ID, dec("4"))
		})
		require.NoError(t, err)
		var reload models.Order
		require.NoError(t, db.First(&reload, o.ID).Error)
		assert.True(t, reload.PaidValue.Equal(dec("4")))
	})
}
