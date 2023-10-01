package controllers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
)

type ProductController struct{}

func NewProductController() ProductController {
	return ProductController{}
}

func (c *ProductController) GetProducts(f *fiber.Ctx) error {
	products := new([]models.Product)

	database.Conn.Order("Name").Find(&products)
	return f.JSON(products)
}

func (c *ProductController) GetEnabledProducts(f *fiber.Ctx) error {
	products := new([]models.Product)
	database.Conn.Order("Name").Where("enabled = ?", true).Find(&products)
	return f.JSON(products)
}

func (c *ProductController) GetProduct(f *fiber.Ctx) error {
	productId, _ := strconv.Atoi(f.Params("id"))
	product := new(models.Product)
	database.Conn.First(&product, productId)
	return f.JSON(product)
}

func (c *ProductController) ToggleProduct(f *fiber.Ctx) error {
	id, err := f.ParamsInt("id")
	product := &models.Product{
		ID: id,
	}

	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	database.Conn.First(&product)
	database.Conn.Model(&product).Update("Enabled", !product.Enabled)
	return f.JSON(&product)
}

func (c *ProductController) CreateProduct(f *fiber.Ctx) error {
	product := new(models.Product)

	if error := f.BodyParser(product); error != nil {
		return error
	}

	result := database.Conn.Create(&product)
	if result.Error != nil {
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	return f.JSON(product)
}

func (c *ProductController) UpdateProduct(f *fiber.Ctx) error {
	product := new(models.Product)

	if error := f.BodyParser(product); error != nil {
		return error
	}

	result := database.Conn.Model(&product).Updates(product)
	if result.Error != nil {
		return f.Status(fiber.StatusBadRequest).SendString(result.Error.Error())
	}

	return f.JSON(product)
}
