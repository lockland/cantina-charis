package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/service"
	"github.com/shopspring/decimal"
)

type DebitController struct {
	debits *service.DebitService
}

func NewDebitController(debits *service.DebitService) DebitController {
	return DebitController{debits: debits}
}

func (c *DebitController) GetDebits(f *fiber.Ctx) error {
	var customers []models.Customer

	err := c.debits.ListCustomersWithOpenOrders(&customers)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

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

	err = f.BodyParser(&payload)
	if err != nil {
		return err
	}

	zero := decimal.NewFromInt(0)
	if payload.CustomerPaidValue.LessThan(zero) {
		return f.Status(fiber.StatusBadRequest).SendString("paid_value must not be negative")
	}

	customer, err := c.debits.PayCustomerDebits(id, payload.CustomerPaidValue)
	if err != nil {
		if errors.Is(err, service.ErrDebitCustomerNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Customer not found")
		}
		if errors.Is(err, service.ErrDebitNoOutstandingWithPayment) {
			return f.Status(fiber.StatusBadRequest).SendString("No outstanding orders for this customer")
		}
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
