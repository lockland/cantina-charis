package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
)

type CustomerController struct{}

func NewCustomerController() CustomerController {
	return CustomerController{}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *CustomerController) GetCustomers(f *fiber.Ctx) error {
	customers := new([]models.Customer)
	database.Conn.Find(customers)
	return f.JSON(customers)
}
