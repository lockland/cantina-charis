package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OrderController struct{}

func NewOrderController() OrderController {
	return OrderController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *OrderController) GetOrder(f *fiber.Ctx) error {
	return f.JSON([]models.Order{})
}

func (c *OrderController) CreateOrder(f *fiber.Ctx) error {
	payload := struct {
		EventID           int             `json:"event_id"`
		CustomerName      string          `json:"customer_name"`
		CustomerPaidValue decimal.Decimal `json:"customer_paid_value"`
		OrderAmount       decimal.Decimal `json:"order_amount"`
		Products          []struct {
			ID       int             `json:"id"`
			Name     string          `json:"name"`
			Quantity int             `json:"quantity"`
			Price    decimal.Decimal `json:"price"`
			Total    decimal.Decimal `json:"total"`
		} `json:"products"`
	}{}

	f.BodyParser(&payload)

	paidValue := payload.CustomerPaidValue

	if payload.CustomerPaidValue.GreaterThan(payload.OrderAmount) {
		paidValue = payload.OrderAmount

	}

	order := models.Order{
		EventID:     payload.EventID,
		PaidValue:   paidValue,
		OrderAmount: payload.OrderAmount,
	}

	debitValue := payload.OrderAmount.Sub(payload.CustomerPaidValue)

	if debitValue.IsNegative() {
		debitValue = decimal.NewFromInt(0)
	}

	var result *gorm.DB

	result = database.Conn.
		Where(models.Customer{Name: payload.CustomerName}).
		Assign(models.Customer{DebitValue: debitValue}).
		FirstOrCreate(&order.Customer)

	if result.Error != nil {
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	transaction := database.Conn.Begin()

	result = transaction.Save(&order)
	if result.Error != nil {
		transaction.Rollback()
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	orderItems := make([]models.OrderProduct, 0)

	contains := func(items []models.OrderProduct, id int) int {
		for index, item := range items {
			if item.ProductID == id {
				return index
			}
		}

		return -1
	}

	for _, el := range payload.Products {
		if index := contains(orderItems, el.ID); index > -1 {
			orderItems[index].ProductQuantity += el.Quantity
			orderItems[index].SubTotal = orderItems[index].SubTotal.Add(el.Total)
		} else {
			orderItems = append(orderItems, models.OrderProduct{
				OrderID:         order.ID,
				CustomerID:      order.Customer.ID,
				ProductID:       el.ID,
				ProductQuantity: el.Quantity,
				SubTotal:        el.Total,
			})
		}
	}

	transaction.Save(&orderItems)

	transaction.
		Preload("Products.OrderProduct").
		Preload(clause.Associations).Find(&order)
	transaction.Commit()
	return f.JSON(order)

}

func (c *OrderController) GetOrders(f *fiber.Ctx) error {
	orders := new([]models.Order)
	database.Conn.
		Preload("Products.OrderProduct").
		Preload(clause.Associations).Find(&orders)
	return f.JSON(orders)
}

func (c *OrderController) DeliveryOrder(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	order := &models.Order{
		ID: id,
	}

	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	database.Conn.Model(&order).Update("Deliveried", true)
	return f.Status(fiber.StatusOK).JSON(fiber.Map{"order_id": id})
}
