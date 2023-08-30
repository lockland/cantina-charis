package main

import (
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/lockland/cantina-charis/server/config"
	"github.com/lockland/cantina-charis/server/database"
)

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

	app.Static("/", "./views", fiber.Static{
		Compress:      true,
		ByteRange:     true,
		Browse:        true,
		Index:         "index.html",
		CacheDuration: 10 * time.Second,
		MaxAge:        3600,
	})

	app.Get("/heathcheck", func(c *fiber.Ctx) error {
		status := "ok"

		if database.Conn == nil {
			status = "fail"
		}

		return c.SendString(status)
	})

	config.SetupApiRoutes(app)

	log.Fatal(app.Listen(":8080"))
}
