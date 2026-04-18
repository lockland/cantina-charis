package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/realtime"
	"github.com/lockland/cantina-charis/server/service"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type OrderController struct {
	orders *service.OrderService
}

func NewOrderController(orders *service.OrderService) OrderController {
	return OrderController{orders: orders}
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

	lines := make([]models.OrderProduct, 0, len(payload.Products))
	for _, el := range payload.Products {
		lines = append(lines, models.OrderProduct{
			ProductID:       el.ID,
			ProductQuantity: el.Quantity,
		})
	}

	err := c.orders.PlaceOrder(payload.CustomerName, &order, lines)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	realtime.NotifyOrderCreated(payload.EventID)

	return f.JSON(order)

}

func (c *OrderController) GetOrders(f *fiber.Ctx) error {
	orders := new([]models.Order)
	err := c.orders.ListAllOrders(orders)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}

func (c *OrderController) PayOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid order id")
	}

	order, err := c.orders.PayOrderFull(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Order not found")
		}
		if errors.Is(err, service.ErrOrderAlreadyFullyPaid) {
			return f.Status(fiber.StatusBadRequest).SendString("Order already paid")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	realtime.NotifyOrdersChanged(order.EventID)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id, "paid_value": order.PaidValue})
}

func (c *OrderController) DeleteOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid order id")
	}

	eventID, err := c.orders.DeleteOrderWithProducts(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Order not found")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	realtime.NotifyOrdersChanged(eventID)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id})
}

func (c *OrderController) DeliveryOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}

	eventID, err := c.orders.MarkOrderDelivered(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Order not found")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	realtime.NotifyOrdersChanged(eventID)
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id})
}
