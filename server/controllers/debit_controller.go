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

	database.Conn.Model(&models.Customer{}).
		Joins(`INNER JOIN orders ON orders.customer_id = customers.id AND CAST(orders.paid_value AS REAL) < CAST(orders.order_amount AS REAL)`).
		Distinct().
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
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
			"total":  customer.Orders.ResidualValue(),
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

	zero := decimal.NewFromInt(0)
	if payload.CustomerPaidValue.LessThan(zero) {
		return f.Status(fiber.StatusBadRequest).SendString("paid_value must not be negative")
	}

	customer := models.Customer{ID: id}

	transaction := database.Conn.Begin()
	if err := transaction.
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
		First(&customer, id).Error; err != nil {
		transaction.Rollback()
		return f.Status(fiber.StatusNotFound).SendString("Customer not found")
	}

	if len(customer.Orders) == 0 && payload.CustomerPaidValue.GreaterThan(zero) {
		transaction.Rollback()
		return f.Status(fiber.StatusBadRequest).SendString("No outstanding orders for this customer")
	}

	customer.Orders.ApplyPaymentValue(payload.CustomerPaidValue)
	for i := range customer.Orders {
		ord := &customer.Orders[i]
		err := transaction.
			Model(&models.Order{ID: ord.ID}).
			Update("paid_value", ord.PaidValue).
			Error
		if err != nil {
			transaction.Rollback()
			return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
		}
	}

	if err := transaction.Commit().Error; err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

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
		"total":  customer.Orders.ResidualValue(),
		"orders": orders,
	}

	return f.JSON(response)
}
