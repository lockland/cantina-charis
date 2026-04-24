package controllers

import (
	"errors"

	"github.com/gofiber/fiber/v3"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/service"
	"gorm.io/gorm"
)

type ProductController struct {
	products *service.ProductService
}

func NewProductController(products *service.ProductService) ProductController {
	return ProductController{products: products}
}

func (c *ProductController) GetProducts(f fiber.Ctx) error {
	var products []models.Product
	err := c.products.FindAllOrderedByName(&products)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(products)
}

func (c *ProductController) GetEnabledProducts(f fiber.Ctx) error {
	var products []models.Product
	err := c.products.FindAllEnabledOrdered(&products)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(products)
}

func (c *ProductController) GetProduct(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}
	var product models.Product
	err := c.products.FindByID(id, &product)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Product not found")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(product)
}

func (c *ProductController) ToggleProduct(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(401).SendString("Invalid id")
	}

	product, err := c.products.ToggleEnabled(id)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return f.Status(fiber.StatusNotFound).SendString("Product not found")
		}
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(product)
}

func (c *ProductController) CreateProduct(f fiber.Ctx) error {
	product := new(models.Product)

	if err := f.Bind().Body(product); err != nil {
		return err
	}

	err := c.products.Create(product)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	return f.JSON(product)
}

func (c *ProductController) UpdateProduct(f fiber.Ctx) error {
	product := new(models.Product)

	if err := f.Bind().Body(product); err != nil {
		return err
	}

	err := c.products.Update(product)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString(err.Error())
	}

	return f.JSON(product)
}

func (c *ProductController) DeleteProduct(f fiber.Ctx) error {
	id := fiber.Params[int](f, "id")
	if id <= 0 {
		return f.Status(fiber.StatusBadRequest).SendString("Invalid id")
	}
	n, err := c.products.DeleteByID(id)
	if err != nil {
		return f.Status(fiber.StatusBadRequest).SendString(err.Error())
	}
	if n == 0 {
		return f.Status(fiber.StatusNotFound).SendString("Product not found")
	}
	return f.SendStatus(fiber.StatusNoContent)
}
