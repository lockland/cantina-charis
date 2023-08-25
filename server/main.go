package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/basicauth"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/lockland/cantina-charis/server/controllers"
	"github.com/lockland/cantina-charis/server/models"
)

type Todo = models.Todo

func main() {
	app := fiber.New()
	app.Use(logger.New(logger.Config{
		Format: "[${ip}]:${port} ${status} - ${method} ${path}\n",
	}))

	app.Use(basicauth.New(basicauth.Config{
		Users: map[string]string{
			"admin": "123456",
		},
	}))
	app.Use(cors.New(cors.ConfigDefault))

	todos := []models.Todo{
		// Todo{
		// 	ID:    1,
		// 	Title: "Teste",
		// 	Done:  false,
		// 	Body:  "Boooddyyyy",
		// },
		// Todo{
		// 	ID:    2,
		// 	Title: "Teste",
		// 	Done:  false,
		// 	Body:  "Boooddyyyy",
		// },
	}

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
	// apiGroup.Get("/orders", func(c *fiber.Ctx) error {
	// 	orders := []map[string]string [
	// 		{
	// 			"id": "1",
	// 		}

	// 	]
	// 	return c.JSON(orders)
	// })

	apiGroup.Post("/todos", func(c *fiber.Ctx) error {
		todo := &Todo{}

		if error := c.BodyParser(todo); error != nil {
			return error
		}

		todo.ID = len(todos) + 1

		todos = append(todos, *todo)

		return c.JSON(todos)
	})

	TodoController := controllers.NewTodoController()
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
