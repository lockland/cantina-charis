package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm/clause"
)

type EventController struct{}

func NewEventController() EventController {
	return EventController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
// GetEvents returns all events when "open" is omitted; with open=true/false filters by Open.
func (c *EventController) GetEvents(f *fiber.Ctx) error {
	events := new([]models.Event)
	q := database.Conn.Order("created_at desc")
	open, parseOpenErr := strconv.ParseBool(f.Query("open"))
	if parseOpenErr == nil {
		q = q.Where("Open = ?", open)
	}
	q.Find(events)
	return f.JSON(events)
}

func (c *EventController) GetEvent(f *fiber.Ctx) error {
	eventId, _ := strconv.Atoi(f.Params("id"))
	event := new(models.Event)
	database.Conn.First(&event, eventId)
	return f.JSON(event)
}

func (c *EventController) CloseEvent(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	event := &models.Event{
		ID: id,
	}

	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	database.Conn.Model(&event).Update("Open", false)
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"event_id": id})
}

func (c *EventController) CreateEvent(f *fiber.Ctx) error {
	event := new(models.Event)

	err := f.BodyParser(event)
	if err != nil {
		return err
	}

	database.Conn.Create(&event)
	return f.JSON(event)
}

func (c *EventController) GetOrders(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}
	event := models.Event{ID: id}
	database.Conn.
		Preload("Orders").
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event)
	return f.JSON(event.Orders)
}

func (c *EventController) GetEventOutgoings(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid event id")
	}
	var outgoings []models.Outgoing
	database.Conn.Where("event_id = ?", id).Order("created_at").Find(&outgoings)
	return f.JSON(outgoings)
}

func (c *EventController) GetPendingOrders(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}
	event := models.Event{ID: id}
	database.Conn.
		Preload("Orders", "deliveried = ?", false).
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event)
	return f.JSON(event.Orders)
}

func (c *EventController) GetActiveOrders(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}
	event := models.Event{ID: id}
	database.Conn.
		Preload("Orders", "deliveried = ? OR CAST(paid_value AS REAL) < CAST(order_amount AS REAL)", false).
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event)
	return f.JSON(event.Orders)
}
