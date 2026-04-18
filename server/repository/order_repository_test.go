package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestOrderRepository_CreateOrderWithLines(t *testing.T) {
	t.Run("given duplicate product lines when creating order then quantities merge", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "OE", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "CustMerge"}
		require.NoError(t, db.Create(&c).Error)
		p := models.Product{Name: "P1", Price: dec("2")}
		require.NoError(t, db.Create(&p).Error)
		order := models.Order{
			EventID:     ev.ID,
			CustomerID:  c.ID,
			Customer:    c,
			OrderAmount: dec("100"),
			PaidValue:   dec("0"),
		}
		lines := []models.OrderProduct{
			{ProductID: p.ID, ProductQuantity: 2},
			{ProductID: p.ID, ProductQuantity: 3},
		}
		r := NewOrderRepository(db)
		require.NoError(t, r.CreateOrderWithLines(&order, lines))
		var ops []models.OrderProduct
		require.NoError(t, db.Where("order_id = ?", order.ID).Find(&ops).Error)
		require.Len(t, ops, 1)
		assert.Equal(t, 5, ops[0].ProductQuantity)
		assert.Equal(t, c.ID, ops[0].CustomerID)
		assert.Equal(t, p.ID, ops[0].ProductID)
	})
}

func TestOrderRepository_DeleteOrderWithProducts(t *testing.T) {
	t.Run("given order with lines when deleting then order and lines removed and event id returned", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "OD", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "CustDel"}
		require.NoError(t, db.Create(&c).Error)
		p := models.Product{Name: "P2", Price: dec("1")}
		require.NoError(t, db.Create(&p).Error)
		order := models.Order{
			EventID:     ev.ID,
			CustomerID:  c.ID,
			Customer:    c,
			OrderAmount: dec("10"),
			PaidValue:   dec("0"),
		}
		require.NoError(t, db.Create(&order).Error)
		op := models.OrderProduct{
			OrderID:         order.ID,
			CustomerID:      c.ID,
			ProductID:       p.ID,
			ProductQuantity: 1,
		}
		require.NoError(t, db.Create(&op).Error)
		r := NewOrderRepository(db)
		eventID, err := r.DeleteOrderWithProducts(order.ID)
		require.NoError(t, err)
		assert.Equal(t, ev.ID, eventID)
		assert.ErrorIs(t, db.First(&models.Order{}, order.ID).Error, gorm.ErrRecordNotFound)
		var n int64
		require.NoError(t, db.Model(&models.OrderProduct{}).Where("order_id = ?", order.ID).Count(&n).Error)
		assert.Zero(t, n)
	})
}

func TestOrderRepository_MarkOrderDelivered(t *testing.T) {
	t.Run("given unpaid completed order when marking delivered then flag set and event id returned", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "OM", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "CustMark"}
		require.NoError(t, db.Create(&c).Error)
		order := models.Order{
			EventID:     ev.ID,
			CustomerID:  c.ID,
			Customer:    c,
			OrderAmount: dec("5"),
			PaidValue:   dec("5"),
			Deliveried:  false,
		}
		require.NoError(t, db.Create(&order).Error)
		r := NewOrderRepository(db)
		eventID, err := r.MarkOrderDelivered(order.ID)
		require.NoError(t, err)
		assert.Equal(t, ev.ID, eventID)
		var reload models.Order
		require.NoError(t, db.First(&reload, order.ID).Error)
		assert.True(t, reload.Deliveried)
	})
}
