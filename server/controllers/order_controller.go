package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/realtime"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderController struct{}

func NewOrderController() OrderController {
	return OrderController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *OrderController) GetOrder(f *fiber.Ctx) error {
	return f.JSON([]models.Order{})
}

func (c *OrderController) CreateOrder(f *fiber.Ctx) error {
	payload := struct {
		EventID           int             `json:"event_id"`
		CustomerName      string          `json:"customer_name"`
		CustomerPaidValue decimal.Decimal `json:"customer_paid_value"`
		Observation       string          `json:"observation"`
		OrderAmount       decimal.Decimal `json:"order_amount"`
		Products          []struct {
			ID       int             `json:"id"`
			Name     string          `json:"name"`
			Quantity int             `json:"quantity"`
			Price    decimal.Decimal `json:"price"`
			Total    decimal.Decimal `json:"total"`
		} `json:"products"`
	}{}

	f.BodyParser(&payload)

	paidValue := payload.CustomerPaidValue

	if payload.CustomerPaidValue.GreaterThan(payload.OrderAmount) {
		paidValue = payload.OrderAmount

	}

	order := models.Order{
		EventID:     payload.EventID,
		PaidValue:   paidValue,
		OrderAmount: payload.OrderAmount,
		Observation: payload.Observation,
	}

	debitValue := payload.OrderAmount.Sub(payload.CustomerPaidValue)

	if debitValue.IsNegative() {
		debitValue = decimal.NewFromInt(0)
	}

	var result *gorm.DB

	result = database.Conn.
		Where(models.Customer{Name: payload.CustomerName}).
		FirstOrCreate(&order.Customer)

	order.Customer.DebitValue = order.Customer.DebitValue.Add(debitValue)

	if result.Error != nil {
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	transaction := database.Conn.Begin()

	result = transaction.Save(&order)
	if result.Error != nil {
		transaction.Rollback()
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	orderItems := make([]models.OrderProduct, 0)

	contains := func(items []models.OrderProduct, id int) int {
		for index, item := range items {
			if item.ProductID == id {
				return index
			}
		}

		return -1
	}

	for _, el := range payload.Products {
		if index := contains(orderItems, el.ID); index > -1 {
			orderItems[index].ProductQuantity += el.Quantity
		} else {
			orderItems = append(orderItems, models.OrderProduct{
				OrderID:         order.ID,
				CustomerID:      order.Customer.ID,
				ProductID:       el.ID,
				ProductQuantity: el.Quantity,
			})
		}
	}

	transaction.Save(&orderItems)

	transaction.
		Preload("OrderProduct.Product").
		Preload(clause.Associations).Find(&order)
	transaction.Commit()

	realtime.NotifyOrderCreated(payload.EventID)

	return f.JSON(order)

}

func (c *OrderController) GetOrders(f *fiber.Ctx) error {
	orders := new([]models.Order)
	database.Conn.
		Preload("OrderProduct.Product").
		Preload(clause.Associations).Find(&orders)
	return f.JSON(orders)
}

func (c *OrderController) PayOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid order id")
	}

	order := &models.Order{ID: id}
	if err := database.Conn.Preload("Customer").First(order).Error; err != nil {
		return f.Status(fiber.StatusNotFound).SendString("Order not found")
	}

	zero := decimal.NewFromInt(0)
	if order.PaidValue.GreaterThanOrEqual(order.OrderAmount) {
		return f.Status(fiber.StatusBadRequest).SendString("Order already paid")
	}

	residual := order.OrderAmount.Sub(order.PaidValue)
	order.PaidValue = order.OrderAmount

	customer := &order.Customer
	customer.DebitValue = customer.DebitValue.Sub(residual)
	if customer.DebitValue.LessThan(zero) {
		customer.DebitValue = zero
	}

	database.Conn.Save(order)
	database.Conn.Model(customer).Update("DebitValue", customer.DebitValue)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id, "paid_value": order.PaidValue})
}

func (c *OrderController) DeleteOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid order id")
	}

	order := &models.Order{ID: id}
	if err := database.Conn.Preload("Customer").First(order).Error; err != nil {
		return f.Status(fiber.StatusNotFound).SendString("Order not found")
	}

	zero := decimal.NewFromInt(0)
	residual := order.OrderAmount.Sub(order.PaidValue)
	if residual.LessThan(zero) {
		residual = zero
	}

	tx := database.Conn.Begin()
	tx.Where("order_id = ?", id).Delete(&models.OrderProduct{})
	tx.Delete(order)
	customer := &order.Customer
	customer.DebitValue = customer.DebitValue.Sub(residual)
	if customer.DebitValue.LessThan(zero) {
		customer.DebitValue = zero
	}
	tx.Model(customer).Update("DebitValue", customer.DebitValue)
	tx.Commit()

	eventID := order.EventID
	realtime.NotifyOrdersChanged(eventID)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id})
}

func (c *OrderController) DeliveryOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}

	var existing models.Order
	if err := database.Conn.Select("id", "event_id").First(&existing, id).Error; err != nil {
		return f.Status(fiber.StatusNotFound).SendString("Order not found")
	}

	database.Conn.Model(&models.Order{ID: id}).Updates(models.Order{
		Deliveried: true,
		DoneAt:     time.Now(),
	})
	realtime.NotifyOrdersChanged(existing.EventID)
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id})
}
