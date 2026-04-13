package main

import (
	"flag"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/config"
	"github.com/lockland/cantina-charis/server/database"
)

func main() {
	dbPath := flag.String("db", "./cantina.db", "caminho do arquivo do banco SQLite")
	serverPort := flag.String("port", "8080", "porta do servidor HTTP")
	flag.Parse()

	database.Connect(*dbPath)

	app := fiber.New(config.FiberConfig())

	config.Configure(app)

	port := os.Getenv("API_PORT")
	if port == "" {
		port = *serverPort
	}

	log.Fatal(app.Listen(":" + port))
}
