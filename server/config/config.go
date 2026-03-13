package config

import (
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/lockland/cantina-charis/server/controllers"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/middleware"
	"github.com/lockland/cantina-charis/server/ws"
)

func Configure(app *fiber.App) {
	ws.DefaultHub = ws.NewHub()
	useCors(app)
	setupWebSocket(app)
	setupApiRoutes(app)
	setupStaticRoutesWithAuth(app)
	setupHealthCheckRoute(app)
}

func useCors(app *fiber.App) {
	app.Use(cors.New(cors.ConfigDefault))
}

func setupWebSocket(app *fiber.App) {
	app.Use("/api/ws", middleware.Auth(), middleware.Authorize(), func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			c.Locals("allowed", true)
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})
	app.Get("/api/ws", websocket.New(func(c *websocket.Conn) {
		ws.DefaultHub.Register(c)
		defer ws.DefaultHub.Unregister(c)
		for {
			if _, _, err := c.ReadMessage(); err != nil {
				break
			}
		}
	}))
}

func setupApiRoutes(app *fiber.App) {
	apiGroup := app.Group("api", middleware.Auth(), middleware.Authorize())

	apiGroup.Get("/auth/me", func(c *fiber.Ctx) error {
		role, _ := c.Locals("role").(string)
		username, _ := c.Locals("username").(string)
		return c.JSON(fiber.Map{"role": role, "username": username})
	})

	orderController := controllers.NewOrderController()
	apiGroup.Post("/orders", orderController.CreateOrder)
	apiGroup.Get("/orders/", orderController.GetOrders)
	apiGroup.Put("/orders/:id/pay", orderController.PayOrder)
	apiGroup.Delete("/orders/:id", orderController.DeleteOrder)
	apiGroup.Put("/orders/:id/done", orderController.DeliveryOrder)

	eventController := controllers.NewEventController()
	apiGroup.Post("/events/", eventController.CreateEvent)
	apiGroup.Get("/events/", eventController.GetEvents)
	apiGroup.Get("/events/:id", eventController.GetEvent)
	apiGroup.Put("/events/:id/close", eventController.CloseEvent)
	apiGroup.Get("/events/:id/orders/pending", eventController.GetPendingOrders)
	apiGroup.Get("/events/:id/orders/active", eventController.GetActiveOrders)
	apiGroup.Get("/events/:id/orders", eventController.GetOrders)

	productController := controllers.NewProductController()
	apiGroup.Post("/products/", productController.CreateProduct)
	apiGroup.Get("/products/", productController.GetProducts)
	apiGroup.Get("/products/enabled", productController.GetEnabledProducts)
	apiGroup.Get("/products/:id", productController.GetProduct)
	apiGroup.Put("/products/", productController.UpdateProduct)
	apiGroup.Delete("/products/:id", productController.DeleteProduct)
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

func setupStaticRoutesWithAuth(app *fiber.App) {
	reactRoutes := []string{
		"/",
		"/orders",
		"/products",
		"/customers-debits",
		"/reports",
	}

	for _, route := range reactRoutes {
		app.Use(route, middleware.Auth(), middleware.Authorize())
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
