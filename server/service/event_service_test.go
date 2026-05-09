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

func TestEventService_FindOrdersForEventWithUndelivered(t *testing.T) {
	t.Run("returns event orders plus undelivered orders from other events", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev1 := models.Event{Name: "EventA", Open: true}
		ev2 := models.Event{Name: "EventB", Open: true}
		require.NoError(t, db.Create(&ev1).Error)
		require.NoError(t, db.Create(&ev2).Error)
		c := models.Customer{Name: "CustA"}
		require.NoError(t, db.Create(&c).Error)
		eventOrder := models.Order{EventID: ev1.ID, CustomerID: c.ID, OrderAmount: decService("10"), PaidValue: decService("0"), Deliveried: false}
		otherOrder := models.Order{EventID: ev2.ID, CustomerID: c.ID, OrderAmount: decService("20"), PaidValue: decService("0"), Deliveried: false}
		require.NoError(t, db.Create(&eventOrder).Error)
		require.NoError(t, db.Create(&otherOrder).Error)

		svc := NewEventService(repository.NewEventRepository(db), repository.NewOrderRepository(db))
		got, err := svc.FindOrdersForEventWithUndelivered(ev1.ID)
		require.NoError(t, err)
		assert.Len(t, got, 2)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, eventOrder.ID)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, otherOrder.ID)
	})
}

func TestEventService_FindPendingOrdersForEventWithUndelivered(t *testing.T) {
	t.Run("returns pending event orders plus undelivered orders from other events", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev1 := models.Event{Name: "EventA", Open: true}
		ev2 := models.Event{Name: "EventB", Open: true}
		require.NoError(t, db.Create(&ev1).Error)
		require.NoError(t, db.Create(&ev2).Error)
		c := models.Customer{Name: "CustB"}
		require.NoError(t, db.Create(&c).Error)
		pendingOrder := models.Order{EventID: ev1.ID, CustomerID: c.ID, OrderAmount: decService("15"), PaidValue: decService("0"), Deliveried: false}
		otherOrder := models.Order{EventID: ev2.ID, CustomerID: c.ID, OrderAmount: decService("25"), PaidValue: decService("0"), Deliveried: false}
		require.NoError(t, db.Create(&pendingOrder).Error)
		require.NoError(t, db.Create(&otherOrder).Error)

		svc := NewEventService(repository.NewEventRepository(db), repository.NewOrderRepository(db))
		got, err := svc.FindPendingOrdersForEventWithUndelivered(ev1.ID)
		require.NoError(t, err)
		assert.Len(t, got, 2)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, pendingOrder.ID)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, otherOrder.ID)
	})
}

func TestEventService_FindActiveOrdersForEventWithUndelivered(t *testing.T) {
	t.Run("returns active event orders plus undelivered orders from other events", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev1 := models.Event{Name: "EventA", Open: false}
		ev2 := models.Event{Name: "EventB", Open: true}
		require.NoError(t, db.Create(&ev1).Error)
		require.NoError(t, db.Create(&ev2).Error)
		c := models.Customer{Name: "CustC"}
		require.NoError(t, db.Create(&c).Error)
		activeOrder := models.Order{EventID: ev1.ID, CustomerID: c.ID, OrderAmount: decService("30"), PaidValue: decService("10"), Deliveried: false}
		otherOrder := models.Order{EventID: ev2.ID, CustomerID: c.ID, OrderAmount: decService("40"), PaidValue: decService("0"), Deliveried: false}
		require.NoError(t, db.Create(&activeOrder).Error)
		require.NoError(t, db.Create(&otherOrder).Error)

		svc := NewEventService(repository.NewEventRepository(db), repository.NewOrderRepository(db))
		got, err := svc.FindActiveOrdersForEventWithUndelivered(ev1.ID)
		require.NoError(t, err)
		assert.Len(t, got, 2)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, activeOrder.ID)
		assert.Contains(t, []int{got[0].ID, got[1].ID}, otherOrder.ID)
	})
}

func decService(s string) decimal.Decimal {
	d, _ := decimal.NewFromString(s)
	return d
}
