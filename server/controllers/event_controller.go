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
func (c *EventController) GetEvents(f *fiber.Ctx) error {
	status, _ := strconv.ParseBool(f.Query("open"))
	events := new([]models.Event)

	database.Conn.Where("Open = ?", status).Last(&events)
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
	f.Status(fiber.StatusOK).JSON(fiber.Map{"event_id": id})
	return nil
}

func (c *EventController) CreateEvent(f *fiber.Ctx) error {
	event := new(models.Event)

	if error := f.BodyParser(event); error != nil {
		return error
	}

	database.Conn.Create(&event)
	return f.JSON(event)
}

func (c *EventController) GetOrders(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	event := models.Event{
		ID: id,
	}

	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	database.Conn.
		Preload("Orders.Products.OrderProduct").
		Preload("Orders.OrderProduct").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event)
	return f.JSON(event.Orders)
}
