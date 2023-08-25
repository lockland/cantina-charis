package controllers

import (
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

type EventController struct{}

func NewEventController() EventController {
	return EventController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *EventController) GetEvents(f *fiber.Ctx) error {
	status, _ := strconv.ParseBool(f.Query("open"))
	return f.JSON([]models.Event{
		{
			Id:         1,
			Name:       "Culto de mulheres",
			OpenAmount: decimal.NewFromFloat(300),
			Open:       status,
			CreatedAt:  time.Now(),
		},
	})
}

func (c *EventController) GetEvent(f *fiber.Ctx) error {
	eventId, _ := strconv.Atoi(f.Params("id"))
	return f.JSON(models.Event{
		Id:         eventId,
		Name:       "Culto de mulheres",
		OpenAmount: decimal.NewFromFloat(300),
		Open:       true,
		CreatedAt:  time.Now(),
	})
}
