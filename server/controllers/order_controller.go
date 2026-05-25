package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v3"
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
func (c *OrderController) GetOrder(f fiber.Ctx) error {
	return f.JSON([]models.Order{})
}

func (c *OrderController) CreateOrder(f fiber.Ctx) error {
	payload, err := bindCreateOrderPayload(f)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	order := payload.toOrder()
	lines := payload.toOrderProducts()

	err = c.orders.PlaceOrder(payload.CustomerName, &order, lines)
	if err != nil {
		return respondPlaceOrderError(f, err)
	}

	realtime.NotifyOrderCreated(payload.EventID)

	return f.JSON(order)
}

func (c *OrderController) GetOrders(f fiber.Ctx) error {
	orders := new([]models.Order)
	err := c.orders.ListAllOrders(orders)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}

// GetActiveOrders returns active orders for the cash register (query param event_id = open event).
func (c *OrderController) GetActiveOrders(f fiber.Ctx) error {
	eventID, ok := eventIDFromQuery(f)
	if !ok {
		return respondInvalidEventID(f)
	}
	orders, err := c.orders.ListActiveOrdersForCashRegister(eventID)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}

func (c *OrderController) PayOrder(f fiber.Ctx) error {
	orderID, ok := orderIDFromParams(f)
	if !ok {
		return respondInvalidOrderID(f)
	}

	order, err := c.orders.PayOrderFull(orderID)
	if err != nil {
		return respondOrderMutationError(f, err)
	}

	realtime.NotifyOrdersChanged(order.EventID)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": orderID, "paid_value": order.PaidValue})
}

func (c *OrderController) DeleteOrder(f fiber.Ctx) error {
	orderID, ok := orderIDFromParams(f)
	if !ok {
		return respondInvalidOrderID(f)
	}

	eventID, err := c.orders.DeleteOrderWithProducts(orderID)
	if err != nil {
		return respondOrderMutationError(f, err)
	}

	realtime.NotifyOrdersChanged(eventID)

	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": orderID})
}

func (c *OrderController) DeliveryOrder(f fiber.Ctx) error {
	orderID, ok := orderIDFromParams(f)
	if !ok {
		return respondInvalidID(f)
	}

	eventID, err := c.orders.MarkOrderDelivered(orderID)
	if err != nil {
		return respondOrderMutationError(f, err)
	}

	realtime.NotifyOrdersChanged(eventID)
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": orderID})
}

type createOrderPayload struct {
	EventID           int             `json:"event_id"`
	CustomerName      string          `json:"customer_name"`
	CustomerPaidValue decimal.Decimal `json:"customer_paid_value"`
	Observation       string          `json:"observation"`
	OrderAmount       decimal.Decimal `json:"order_amount"`
	Products          []createOrderProductPayload `json:"products"`
}

type createOrderProductPayload struct {
	ID       int             `json:"id"`
	Name     string          `json:"name"`
	Quantity int             `json:"quantity"`
	Price    decimal.Decimal `json:"price"`
	Total    decimal.Decimal `json:"total"`
}

func bindCreateOrderPayload(f fiber.Ctx) (createOrderPayload, error) {
	payload := createOrderPayload{}
	err := f.Bind().Body(&payload)
	if err != nil {
		return createOrderPayload{}, err
	}
	return payload, nil
}

func (payload createOrderPayload) toOrder() models.Order {
	return models.Order{
		EventID:     payload.EventID,
		PaidValue:   paidValueCapped(payload.CustomerPaidValue, payload.OrderAmount),
		OrderAmount: payload.OrderAmount,
		Observation: payload.Observation,
	}
}

func (payload createOrderPayload) toOrderProducts() []models.OrderProduct {
	lines := make([]models.OrderProduct, 0, len(payload.Products))
	for _, product := range payload.Products {
		lines = append(lines, models.OrderProduct{
			ProductID:       product.ID,
			ProductQuantity: product.Quantity,
		})
	}
	return lines
}

func respondPlaceOrderError(f fiber.Ctx, err error) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return respondEventNotFoundJSON(f)
	}
	if errors.Is(err, service.ErrEventClosed) {
		return respondEventClosedJSON(f)
	}
	return f.Status(fiber.StatusBadRequest).SendString(err.Error())
}
