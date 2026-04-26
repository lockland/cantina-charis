package controllers

import "github.com/gofiber/fiber/v3"

func respondEventNotFoundJSON(c fiber.Ctx) error {
	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
		"error": "Evento não encontrado",
		"code":  "EVENT_NOT_FOUND",
	})
}

func respondEventClosedJSON(c fiber.Ctx) error {
	return c.Status(fiber.StatusForbidden).JSON(fiber.Map{
		"error": "evento fechado",
		"code":  "EVENT_CLOSED",
	})
}
