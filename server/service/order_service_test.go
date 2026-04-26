package service

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestOrderService_PlaceOrder(t *testing.T) {
	t.Run("given new customer name and lines when placing order then persists customer and order", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "E", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		p := models.Product{Name: "P", Price: dec("1")}
		require.NoError(t, db.Create(&p).Error)
		repo := repository.NewOrderRepository(db)
		svc := NewOrderService(repo, repository.NewEventRepository(db))
		order := models.Order{
			EventID:     ev.ID,
			OrderAmount: dec("10"),
			PaidValue:   dec("0"),
		}
		lines := []models.OrderProduct{{ProductID: p.ID, ProductQuantity: 2}}
		require.NoError(t, svc.PlaceOrder("NewCust", &order, lines))
		assert.NotZero(t, order.ID)
		assert.Equal(t, "NewCust", order.Customer.Name)
		var cust models.Customer
		require.NoError(t, db.Where("name = ?", "NewCust").First(&cust).Error)
		assert.Equal(t, cust.ID, order.CustomerID)
	})

	t.Run("given closed event when placing order then event closed error", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "Closed"}
		require.NoError(t, db.Create(&ev).Error)
		// Explicit close: GORM may omit Open=false on insert when column has default:true.
		require.NoError(t, db.Model(&models.Event{}).Where("id = ?", ev.ID).Update("open", false).Error)
		p := models.Product{Name: "P2", Price: dec("1")}
		require.NoError(t, db.Create(&p).Error)
		svc := NewOrderService(repository.NewOrderRepository(db), repository.NewEventRepository(db))
		order := models.Order{
			EventID:     ev.ID,
			OrderAmount: dec("5"),
			PaidValue:   dec("0"),
		}
		lines := []models.OrderProduct{{ProductID: p.ID, ProductQuantity: 1}}
		err := svc.PlaceOrder("C", &order, lines)
		assert.ErrorIs(t, err, ErrEventClosed)
	})
}

func TestOrderService_PayOrderFull(t *testing.T) {
	t.Run("given no order for id when paying full then record not found", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		svc := NewOrderService(repository.NewOrderRepository(db), repository.NewEventRepository(db))
		_, err := svc.PayOrderFull(999)
		assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
	})

	t.Run("given order already fully paid when paying full then already fully paid error", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "E2", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "C2"}
		require.NoError(t, db.Create(&c).Error)
		order := models.Order{
			EventID:     ev.ID,
			CustomerID:  c.ID,
			OrderAmount: dec("10"),
			PaidValue:   dec("10"),
		}
		require.NoError(t, db.Create(&order).Error)
		svc := NewOrderService(repository.NewOrderRepository(db), repository.NewEventRepository(db))
		_, err := svc.PayOrderFull(order.ID)
		assert.ErrorIs(t, err, ErrOrderAlreadyFullyPaid)
	})

	t.Run("given partially paid order when paying full then paid value equals order amount", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "E3", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		c := models.Customer{Name: "C3"}
		require.NoError(t, db.Create(&c).Error)
		order := models.Order{
			EventID:     ev.ID,
			CustomerID:  c.ID,
			OrderAmount: dec("10"),
			PaidValue:   dec("3"),
		}
		require.NoError(t, db.Create(&order).Error)
		svc := NewOrderService(repository.NewOrderRepository(db), repository.NewEventRepository(db))
		out, err := svc.PayOrderFull(order.ID)
		require.NoError(t, err)
		require.NotNil(t, out)
		assert.True(t, out.PaidValue.Equal(dec("10")))
		var reload models.Order
		require.NoError(t, db.First(&reload, order.ID).Error)
		assert.True(t, reload.PaidValue.Equal(dec("10")))
	})
}
