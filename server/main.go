package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/lockland/cantina-charis/server/controllers"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/lockland/cantina-charis/server/models"
)

type Todo = models.Todo

func main() {
	database.Connect("./cantina.db")

	app := fiber.New()
	app.Use(logger.New())

	// app.Use(basicauth.New(basicauth.Config{
	// 	Users: map[string]string{
	// 		"admin": "123456",
	// 	},
	// }))
	app.Use(cors.New(cors.ConfigDefault))

	todos := []models.Todo{}

	app.Static("/", "./views", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        true,
		Index:         "index.html",
		CacheDuration: 10 * time.Second,
		MaxAge:        3600,
	})

	app.Get("/heathcheck", func(c *fiber.Ctx) error {
		return c.SendString("ok")
	})

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

	TodoController := controllers.NewTodoController()
	apiGroup.Post("/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if error := c.BodyParser(todo); error != nil {
			return error
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	apiGroup.Get("/todos", TodoController.GetTodos)

	apiGroup.Patch("/todos/:id/done", func(c *fiber.Ctx) error {
		id, err := c.ParamsInt("id")

		if err != nil {
			return c.Status(401).SendString("Invalid id")
		}

		for i, t := range todos {
			if t.ID == id {
				todos[i].Done = true
				break
			}
		}

		return c.JSON(todos)
	})

	log.Fatal(app.Listen(":8080"))
}
