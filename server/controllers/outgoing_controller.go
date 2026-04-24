package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"gorm.io/gorm"
)

type OutgoingController struct {
	outgoings *repository.OutgoingRepository
	events    *repository.EventRepository
}

func NewOutgoingController(outgoings *repository.OutgoingRepository, events *repository.EventRepository) OutgoingController {
	return OutgoingController{outgoings: outgoings, events: events}
}

func (c *OutgoingController) CreateOutgoing(f *fiber.Ctx) error {
	outgoing := new(models.Outgoing)

	err := f.BodyParser(outgoing)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error":   "Não foi possível registrar a despesa",
			"details": err.Error(),
		})
	}

	isOpen, err := c.events.IsOpen(outgoing.EventID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).JSON(fiber.Map{
				"error": "Evento não encontrado",
				"code":  "EVENT_NOT_FOUND",
			})
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	if !isOpen {
		return f.Status(fiber.StatusForbidden).JSON(fiber.Map{
			"error": "evento fechado",
			"code":  "EVENT_CLOSED",
		})
	}

	err = c.outgoings.Create(outgoing)
	if err != nil {
		return f.Status(fiber.StatusConflict).JSON(fiber.Map{
			"error":   "Despesa com descrição e valor já cadastrada neste evento",
			"details": err.Error(),
		})
	}

	return f.JSON(fiber.Map{
		"outgoing_id": outgoing.ID,
		"event_id":    outgoing.EventID,
	})
}

func (c *OutgoingController) GetOutgoings(f *fiber.Ctx) error {
	var list []models.Outgoing
	err := c.outgoings.FindAll(&list)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(list)
}
