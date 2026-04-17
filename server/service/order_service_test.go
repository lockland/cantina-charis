package service

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestOrderService_PlaceOrder_createsCustomerAndOrder(t *testing.T) {
	db := testutil.OpenSQLite(t)
	ev := models.Event{Name: "E", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	p := models.Product{Name: "P", Price: dec("1")}
	require.NoError(t, db.Create(&p).Error)

	repo := repository.NewOrderRepository(db)
	svc := NewOrderService(repo)

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
}

func TestOrderService_PayOrderFull_notFound(t *testing.T) {
	db := testutil.OpenSQLite(t)
	svc := NewOrderService(repository.NewOrderRepository(db))
	_, err := svc.PayOrderFull(999)
	assert.ErrorIs(t, err, gorm.ErrRecordNotFound)
}

func TestOrderService_PayOrderFull_alreadyPaid(t *testing.T) {
	db := testutil.OpenSQLite(t)
	ev := models.Event{Name: "E2", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	c := models.Customer{Name: "C2"}
	require.NoError(t, db.Create(&c).Error)
	order := models.Order{
		EventID:     ev.ID,
		CustomerID:  c.ID,
		OrderAmount: decimal.RequireFromString("10"),
		PaidValue:   decimal.RequireFromString("10"),
	}
	require.NoError(t, db.Create(&order).Error)

	svc := NewOrderService(repository.NewOrderRepository(db))
	_, err := svc.PayOrderFull(order.ID)
	assert.ErrorIs(t, err, ErrOrderAlreadyFullyPaid)
}

func TestOrderService_PayOrderFull_setsPaidToAmount(t *testing.T) {
	db := testutil.OpenSQLite(t)
	ev := models.Event{Name: "E3", Open: true}
	require.NoError(t, db.Create(&ev).Error)
	c := models.Customer{Name: "C3"}
	require.NoError(t, db.Create(&c).Error)
	order := models.Order{
		EventID:     ev.ID,
		CustomerID:  c.ID,
		OrderAmount: decimal.RequireFromString("10"),
		PaidValue:   decimal.RequireFromString("3"),
	}
	require.NoError(t, db.Create(&order).Error)

	svc := NewOrderService(repository.NewOrderRepository(db))
	out, err := svc.PayOrderFull(order.ID)
	require.NoError(t, err)
	require.NotNil(t, out)
	assert.True(t, out.PaidValue.Equal(decimal.RequireFromString("10")))

	var reload models.Order
	require.NoError(t, db.First(&reload, order.ID).Error)
	assert.True(t, reload.PaidValue.Equal(decimal.RequireFromString("10")))
}
