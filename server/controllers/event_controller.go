package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
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
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"event_id": id})
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
		Preload("Orders", "deliveried = ?", false).
		Preload("Orders.Products.OrderProduct").
		Preload("Orders.OrderProduct").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event)
	return f.JSON(event.Orders)
}

func (c *EventController) GetSummaries(f *fiber.Ctx) error {
	rawQuery := `
	select
		id,
		name,
		created_at,
		open_amount,
		incoming,
		outgoing,
		0 as balance,
		0 as liquid_funds
	from
		events
		left join (
			select
				sum(orders.order_amount) as incoming,
				event_id
			from
				orders
			group by
				event_id
		) as incomings
				on incomings.event_id = events.id
		left join (
			select
				sum(amount) as outgoing,
				event_id
			from
				outgoings
			group by
				event_id
		) as outgoings
			on outgoings.event_id = events.id;
	`

	result := []struct {
		Id          int             `json:"event_id"`
		Name        string          `json:"event_name"`
		CreatedAt   time.Time       `json:"created_at"`
		OpenAmount  decimal.Decimal `json:"open_amount"`
		Incoming    decimal.Decimal `json:"incoming"`
		Outgoing    decimal.Decimal `json:"outgoing"`
		Balance     decimal.Decimal `json:"balance"`
		LiquidFunds decimal.Decimal `json:"liquid_funds"`
	}{}

	database.Conn.Raw(rawQuery).Scan(&result)

	for index, summary := range result {
		summary.Balance = summary.OpenAmount.Add(summary.Incoming).Sub(summary.Outgoing)
		summary.LiquidFunds = summary.Incoming.Sub(summary.Outgoing)
		result[index] = summary
	}

	return f.JSON(result)
}
