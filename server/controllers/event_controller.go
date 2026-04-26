package controllers

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/service"
	"gorm.io/gorm"
)

type EventController struct {
	events *service.EventService
}

func NewEventController(events *service.EventService) EventController {
	return EventController{events: events}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
// GetEvents returns all events when "open" is omitted; with open=true/false filters by Open.
func (c *EventController) GetEvents(f fiber.Ctx) error {
	var open *bool
	if q := f.Query("open"); q != "" {
		if v, parseErr := strconv.ParseBool(q); parseErr == nil {
			open = &v
		}
	}
	events, err := c.events.ListEvents(open)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(events)
}

func (c *EventController) GetEvent(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}
	var event models.Event
	err := c.events.FindByID(id, &event)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Event not found")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(event)
}

func (c *EventController) CloseEvent(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(401).SendString("Invalid id")
	}

	err := c.events.Close(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"event_id": id})
}

func (c *EventController) CreateEvent(f fiber.Ctx) error {
	event := new(models.Event)

	if err := f.Bind().Body(event); err != nil {
		return err
	}

	err := c.events.Create(event)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(event)
}

func (c *EventController) GetOrders(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(401).SendString("Invalid id")
	}
	orders, err := c.events.FindOrdersForEvent(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}

func (c *EventController) GetEventOutgoings(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid event id")
	}
	outgoings, err := c.events.FindOutgoingsByEventID(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(outgoings)
}

func (c *EventController) GetPendingOrders(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(401).SendString("Invalid id")
	}
	orders, err := c.events.FindPendingOrdersForEvent(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}

func (c *EventController) GetActiveOrders(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(401).SendString("Invalid id")
	}
	orders, err := c.events.FindActiveOrdersForEvent(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(orders)
}
