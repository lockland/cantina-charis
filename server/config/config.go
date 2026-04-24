package config

import (
	"errors"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/lockland/cantina-charis/server/controllers"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/middleware"
	"github.com/lockland/cantina-charis/server/realtime"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/lockland/cantina-charis/server/service"
)

const viewsIndex = "./views/index.html"

// serveSPAOrStatic serve ficheiros em ./views ou index.html para rotas SPA (path sem extensão). Conteúdo em views é público.
func serveSPAOrStatic(c *fiber.Ctx) error {
	path := c.Path()
	if path == "/" || !strings.Contains(path, ".") {
		return c.SendFile(viewsIndex)
	}
	viewsRoot := filepath.Clean("./views")
	clean := filepath.Clean(filepath.Join(viewsRoot, strings.TrimPrefix(path, "/")))
	rel, err := filepath.Rel(viewsRoot, clean)
	if err != nil || strings.HasPrefix(rel, "..") {
		return c.SendFile(viewsIndex)
	}
	sendErr := c.SendFile(clean)
	if sendErr != nil {
		return c.SendFile(viewsIndex)
	}
	return nil
}

// FiberConfig retorna a config do Fiber com ErrorHandler custom.
// Ver: https://docs.gofiber.io/v2.x/guide/error-handling
func FiberConfig() fiber.Config {
	return fiber.Config{
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			var e *fiber.Error
			if errors.As(err, &e) {
				code = e.Code
			}
			c.Set(fiber.HeaderContentType, fiber.MIMETextPlainCharsetUTF8)
			if e != nil {
				return c.Status(code).SendString(e.Message)
			}
			return c.Status(code).SendString("Internal Server Error")
		},
	}
}

func Configure(app *fiber.App) {
	useCors(app)
	useAuthAndAuthorize(app)
	setupApiRoutes(app)
	setupSPAAndStatic(app)
}

func useAuthAndAuthorize(app *fiber.App) {
	app.Use(middleware.Auth(), middleware.Authorize())
}

func useCors(app *fiber.App) {
	app.Use(cors.New(cors.ConfigDefault))
}

// setupApiRoutes registra rotas sob /api com Auth+Authorize.
// Ordem: rotas fixas antes de rotas com parâmetros (recomendado em https://docs.gofiber.io/v2.x/guide/routing).
func setupApiRoutes(app *fiber.App) {
	api := app.Group("/api")

	api.Get("/auth/me", func(c *fiber.Ctx) error {
		role, _ := c.Locals("role").(string)
		username, _ := c.Locals("username").(string)
		return c.JSON(fiber.Map{"role": role, "username": username})
	})

	api.Get("/ws/orders", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	}, websocket.New(func(c *websocket.Conn) {
		eventID, err := strconv.Atoi(c.Query("event_id"))
		if err != nil || eventID <= 0 {
			_ = c.Close()
			return
		}
		cc := realtime.Register(eventID, c)
		if cc == nil {
			_ = c.Close()
			return
		}
		defer realtime.Unregister(eventID, cc)
		for {
			_, _, readErr := c.ReadMessage()
			if readErr != nil {
				break
			}
		}
	}))

	db := database.Conn
	orderRepo := repository.NewOrderRepository(db)
	eventRepo := repository.NewEventRepository(db)
	orderController := controllers.NewOrderController(service.NewOrderService(orderRepo, eventRepo))
	api.Post("/orders", orderController.CreateOrder)
	api.Get("/orders", orderController.GetOrders)
	api.Put("/orders/:id/pay", orderController.PayOrder)
	api.Delete("/orders/:id", orderController.DeleteOrder)
	api.Put("/orders/:id/done", orderController.DeliveryOrder)

	eventController := controllers.NewEventController(eventRepo)
	api.Post("/events", eventController.CreateEvent)
	api.Get("/events", eventController.GetEvents)
	api.Get("/events/:id", eventController.GetEvent)
	api.Put("/events/:id/close", eventController.CloseEvent)
	api.Get("/events/:id/outgoings", eventController.GetEventOutgoings)
	api.Get("/events/:id/orders/pending", eventController.GetPendingOrders)
	api.Get("/events/:id/orders/active", eventController.GetActiveOrders)
	api.Get("/events/:id/orders", eventController.GetOrders)

	productRepo := repository.NewProductRepository(db)
	productController := controllers.NewProductController(productRepo)
	api.Post("/products", productController.CreateProduct)
	api.Get("/products", productController.GetProducts)
	api.Get("/products/enabled", productController.GetEnabledProducts)
	api.Get("/products/:id", productController.GetProduct)
	api.Put("/products", productController.UpdateProduct)
	api.Delete("/products/:id", productController.DeleteProduct)
	api.Put("/products/:id/toggle", productController.ToggleProduct)

	outgoingRepo := repository.NewOutgoingRepository(db)
	outgoingController := controllers.NewOutgoingController(outgoingRepo, eventRepo)
	api.Post("/outgoings", outgoingController.CreateOutgoing)
	api.Get("/outgoings", outgoingController.GetOutgoings)

	customerRepo := repository.NewCustomerRepository(db)
	customerController := controllers.NewCustomerController(customerRepo)
	api.Get("/customers", customerController.GetCustomers)

	debitRepo := repository.NewDebitRepository(db)
	debitController := controllers.NewDebitController(service.NewDebitService(debitRepo))
	api.Get("/debits", debitController.GetDebits)
	api.Put("/debits/:customer_id/pay", debitController.PayDebits)

	// Grupo /reports: rotas fixas antes de :param (balance/:lastDays, payments/:customer_id)
	reportRepo := repository.NewReportRepository(db)
	reportController := controllers.NewReportController(reportRepo)
	reports := api.Group("/reports")
	reports.Get("/summaries", reportController.GetSummaries)
	reports.Get("/outgoings", reportController.GetOutgoingsByDateRange)
	reports.Get("/balance/:lastDays", reportController.GetBalance)
	reports.Get("/payments/:customer_id", reportController.GetPayments)
}

func setupSPAAndStatic(app *fiber.App) {
	// /assets/* servido pelo Static; demais GETs (/, /reports/outgoings, favicon, etc.) por serveSPAOrStatic (ficheiro ou index.html).
	app.Static("/assets", "./views/assets", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        false,
		CacheDuration: 10 * time.Second,
		MaxAge:        3600,
	})

	app.Get("/", serveSPAOrStatic)
	app.Get("/*", serveSPAOrStatic)
}
