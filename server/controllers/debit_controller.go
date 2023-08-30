package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

type DebitController struct{}

func NewDebitController() DebitController {
	return DebitController{}
}

func (c *DebitController) GetDebits(f *fiber.Ctx) error {
	var customers []models.Customer

	database.Conn.
		Preload("Orders").
		Preload("Orders.Event").
		Where("debit_value > 0").
		Find(&customers)

	response := []fiber.Map{}

	for _, entry := range customers {
		orders := []fiber.Map{}
		total := decimal.NewFromFloat(0.0)

		for _, order := range entry.Orders {
			total = total.Add(entry.DebitValue)
			orders = append(orders, fiber.Map{
				"order_id":     order.ID,
				"event_name":   order.Event.Name,
				"event_date":   order.Event.CreatedAt,
				"order_amount": order.OrderAmount,
				"paid_value":   order.PaidValue,
			})
		}

		response = append(response, fiber.Map{
			"customer": fiber.Map{
				"id":   entry.ID,
				"name": entry.Name,
			},
			"total":  total,
			"orders": orders,
		})
	}

	return f.JSON(response)
}

func (c *DebitController) PayDebits(f *fiber.Ctx) error {
	return f.JSON([]models.Order{})
}
