package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
)

type OutgoingController struct{}

func NewOutgoingController() OutgoingController {
	return OutgoingController{}
}

func (c *OutgoingController) CreateOutgoing(f *fiber.Ctx) error {
	outgoing := new(models.Outgoing)

	if error := f.BodyParser(outgoing); error != nil {
		return f.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Não foi possível registrar a despesa",
			"details": error.Error(),
		})
	}

	result := database.Conn.Create(&outgoing)

	if result.Error != nil {
		return f.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error": "Despesa com descrição e valor já cadastrada neste evento",
			"details": result.Error.Error(),
		})
	}

	return f.JSON(fiber.Map{
		"outgoing_id": outgoing.ID,
		"event_id":    outgoing.EventID,
	})
}

func (c *OutgoingController) GetOutgoings(f *fiber.Ctx) error {
	outgoings := new([]models.Outgoing)
	database.Conn.Find(&outgoings)
	return f.JSON(outgoings)
}
