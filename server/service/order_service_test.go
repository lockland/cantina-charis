package service

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
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
