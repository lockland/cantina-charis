package main

import (
	"flag"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/config"
	"github.com/lockland/cantina-charis/server/database"
)

func main() {
	dbPath := flag.String("db", "./cantina.db", "caminho do arquivo do banco SQLite")
	flag.Parse()

	database.Connect(*dbPath)

	app := fiber.New(config.FiberConfig())

	config.Configure(app)

	log.Fatal(app.Listen(":8080"))
}
