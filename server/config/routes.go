package config

import (
	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/controllers"
)

func SetupApiRoutes(app *fiber.App) {
	apiGroup := app.Group("api")

	eventController := controllers.NewEventController()
	apiGroup.Post("/events/", eventController.CreateEvent)
	apiGroup.Get("/events/", eventController.GetEvents)
	apiGroup.Get("/events/:id", eventController.GetEvent)
	apiGroup.Put("/events/:id/close", eventController.CloseEvent)

	productController := controllers.NewProductController()
	apiGroup.Post("/products/", productController.CreateProduct)
	apiGroup.Get("/products/", productController.GetProducts)
	apiGroup.Get("/products/enabled", productController.GetEnabledProducts)
	apiGroup.Get("/products/:id", productController.GetProduct)
	apiGroup.Put("/products/:id/toggle", productController.ToggleProduct)

	outgoingController := controllers.NewOutgoingController()
	apiGroup.Post("/outgoings", outgoingController.CreateOutgoing)

	customerController := controllers.NewCustomerController()
	apiGroup.Get("/customers", customerController.GetCustomers)

}