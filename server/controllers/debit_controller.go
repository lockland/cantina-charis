package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

type DebitController struct{}

func NewDebitController() DebitController {
	return DebitController{}
}

func (c *DebitController) GetDebits(f *fiber.Ctx) error {
	var customers []models.Customer

	database.Conn.
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at").Where("paid_value < order_amount")
		}).
		Preload("Orders.Event").
		Where("debit_value > 0").
		Find(&customers)

	response := []fiber.Map{}

	for _, customer := range customers {
		orders := []fiber.Map{}
		for _, order := range customer.Orders {
			orderDate := order.CreatedAt

			if order.CreatedAt.Before(order.Event.CreatedAt) {
				orderDate = order.Event.CreatedAt
			}

			orders = append(orders, fiber.Map{
				"order_id":     order.ID,
				"event_name":   order.Event.Name,
				"order_date":   orderDate,
				"order_amount": order.OrderAmount,
				"paid_value":   order.PaidValue,
			})
		}

		response = append(response, fiber.Map{
			"customer": fiber.Map{
				"id":   customer.ID,
				"name": customer.Name,
			},
			"total":  customer.DebitValue,
			"orders": orders,
		})
	}

	return f.JSON(response)
}

func (c *DebitController) PayDebits(f *fiber.Ctx) error {
	id, err := f.ParamsInt("customer_id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	payload := struct {
		CustomerPaidValue decimal.Decimal `json:"paid_value"`
	}{}

	if error := f.BodyParser(&payload); error != nil {
		return error
	}

	customer := models.Customer{
		ID: id,
	}

	transaction := database.Conn.Begin()
	transaction.
		Preload("Orders", "paid_value < order_amount").
		Preload("Orders.Event").
		Find(&customer)

	zero := decimal.NewFromInt(0)

	if customer.DebitValue.Sub(payload.CustomerPaidValue).LessThanOrEqual(zero) {
		customer.DebitValue = decimal.NewFromInt(0)
	} else {
		customer.DebitValue = customer.DebitValue.Sub(payload.CustomerPaidValue)
	}

	for index, order := range customer.Orders {
		if order.OrderAmount.LessThanOrEqual(payload.CustomerPaidValue) {
			customer.Orders[index].PaidValue = order.OrderAmount
			payload.CustomerPaidValue = payload.CustomerPaidValue.Sub(order.OrderAmount)
		} else {
			customer.Orders[index].PaidValue = payload.CustomerPaidValue
		}
	}

	transaction.Save(&customer)
	transaction.Commit()

	orders := []fiber.Map{}
	for _, order := range customer.Orders {
		orderDate := order.CreatedAt

		if order.CreatedAt.Before(order.Event.CreatedAt) {
			orderDate = order.Event.CreatedAt
		}

		orders = append(orders, fiber.Map{
			"order_id":     order.ID,
			"event_name":   order.Event.Name,
			"order_date":   orderDate,
			"order_amount": order.OrderAmount,
			"paid_value":   order.PaidValue,
		})
	}

	response := fiber.Map{
		"customer": fiber.Map{
			"id":   customer.ID,
			"name": customer.Name,
		},
		"total":  customer.DebitValue,
		"orders": orders,
	}

	return f.JSON(response)
}
