package database

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var Conn *gorm.DB
var err error

func Connect(url string) {
	Conn, err = gorm.Open(sqlite.Open(url), &gorm.Config{
		Logger:               logger.Default.LogMode(logger.Info),
		FullSaveAssociations: true,
	})
	if err != nil {
		panic("failed to connect database")
	}

	Conn.Exec("PRAGMA foreign_keys = ON;")

	Conn.AutoMigrate(
		new(models.Event),
		new(models.Outgoing),
		new(models.Customer),
		new(models.Product),
		new(models.Order),
		new(models.OrderProduct),
	)

	Conn.SetupJoinTable(&models.Order{}, "Products", &models.OrderProduct{})
	Conn.SetupJoinTable(&models.Product{}, "Orders", &models.OrderProduct{})
}
