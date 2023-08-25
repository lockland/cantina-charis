package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
)

type CustomerController struct{}

func NewCustomerController() CustomerController {
	return CustomerController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *CustomerController) GetCustomer(f *fiber.Ctx) error {
	return f.JSON([]models.Customer{
		{
			CustomerId:   1,
			CustomerName: "Name",
			DebitValue:   decimal.NewFromInt(12),
		},
		{
			CustomerId:   2,
			CustomerName: "Name2",
			DebitValue:   decimal.NewFromFloat(12.02),
		},
	})
}
