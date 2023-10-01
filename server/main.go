package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/config"
	"github.com/lockland/cantina-charis/server/database"
)

func main() {
	database.Connect("./cantina.db")

	app := fiber.New()

	config.Configure(app)

	log.Fatal(app.Listen(":8080"))
}
