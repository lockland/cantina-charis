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
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		panic("failed to connect database")
	}

	Conn.AutoMigrate(&models.Event{})
}
