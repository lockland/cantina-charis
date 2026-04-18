package controllers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

type CustomerController struct {
	customers *repository.CustomerRepository
}

func NewCustomerController(customers *repository.CustomerRepository) CustomerController {
	return CustomerController{customers: customers}
}

// https://pkg.go.dev/github.com/shopspring/decimal#section-readme
func (c *CustomerController) GetCustomers(f *fiber.Ctx) error {
	var customers []models.Customer
	err := c.customers.FindAll(&customers)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(customers)
}
