package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
)

type OrderController struct{}

func NewOrderController() OrderController {
	return OrderController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *OrderController) GetOrder(f *fiber.Ctx) error {
	return f.JSON([]models.Order{})
}
