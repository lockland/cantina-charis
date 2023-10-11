package config

import (
	"io"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/lockland/cantina-charis/server/controllers"
	"github.com/lockland/cantina-charis/server/database"
)

func Configure(app *fiber.App) {
	useCors(app)
	useFileLogger(app)
	setupApiRoutes(app)
	setupStaticRoutes(app)
	setupHealthCheckRoute(app)
}

func useFileLogger(app *fiber.App) {
	file, _ := os.OpenFile("./cantina.log", os.O_RDWR|os.O_CREATE|os.O_APPEND, 0666)

	defer file.Close()
	iw := io.MultiWriter(os.Stdout, file)

	app.Use(logger.New(logger.Config{
		Output: iw,
	}))
}

func useCors(app *fiber.App) {
	app.Use(cors.New(cors.ConfigDefault))
}

func setupApiRoutes(app *fiber.App) {
	apiGroup := app.Group("api")
	orderController := controllers.NewOrderController()
	apiGroup.Post("/orders", orderController.CreateOrder)
	apiGroup.Get("/orders/", orderController.GetOrders)
	apiGroup.Put("/orders/:id/done", orderController.DeliveryOrder)

	eventController := controllers.NewEventController()
	apiGroup.Post("/events/", eventController.CreateEvent)
	apiGroup.Get("/events/", eventController.GetEvents)
	apiGroup.Get("/events/:id", eventController.GetEvent)
	apiGroup.Put("/events/:id/close", eventController.CloseEvent)
	apiGroup.Get("/events/:id/orders", eventController.GetOrders)

	productController := controllers.NewProductController()
	apiGroup.Post("/products/", productController.CreateProduct)
	apiGroup.Get("/products/", productController.GetProducts)
	apiGroup.Get("/products/enabled", productController.GetEnabledProducts)
	apiGroup.Get("/products/:id", productController.GetProduct)
	apiGroup.Put("/products/", productController.UpdateProduct)
	apiGroup.Put("/products/:id/toggle", productController.ToggleProduct)

	outgoingController := controllers.NewOutgoingController()
	apiGroup.Post("/outgoings", outgoingController.CreateOutgoing)
	apiGroup.Get("/outgoings", outgoingController.GetOutgoings)

	customerController := controllers.NewCustomerController()
	apiGroup.Get("/customers", customerController.GetCustomers)

	debitController := controllers.NewDebitController()
	apiGroup.Get("/debits", debitController.GetDebits)
	apiGroup.Put("/debits/:customer_id/pay", debitController.PayDebits)

	reportController := controllers.NewReportController()
	apiGroup.Get("/reports/summaries", reportController.GetSummaries)
	apiGroup.Get("/reports/balance/:lastDays", reportController.GetBalance)
	apiGroup.Get("/reports/payments/:customer_id", reportController.GetPayments)
}

func setupStaticRoutes(app *fiber.App) {
	reactRoutes := []string{
		"/",
		"/orders",
		"/products",
		"/customers-debits",
		"/reports",
	}

	for _, route := range reactRoutes {
		app.Static(route, "./views", fiber.Static{
			Compress:      true,
			ByteRange:     true,
			Browse:        true,
			Index:         "index.html",
			CacheDuration: 10 * time.Second,
			MaxAge:        3600,
		})
	}
}
func setupHealthCheckRoute(app *fiber.App) {

	app.Get("/heathcheck", func(c *fiber.Ctx) error {
		status := "ok"

		if database.Conn == nil {
			status = "fail"
		}

		return c.SendString(status)
	})
}
