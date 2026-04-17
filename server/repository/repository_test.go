package repository

import (
	"path/filepath"
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/require"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

func openTestDB(t *testing.T) *gorm.DB {
	t.Helper()
	path := filepath.Join(t.TempDir(), "test.db")
	db, err := gorm.Open(sqlite.Open(path), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Silent),
	})
	require.NoError(t, err)
	require.NoError(t, db.Exec("PRAGMA foreign_keys = ON;").Error)
	require.NoError(t, db.AutoMigrate(
		&models.Event{},
		&models.Outgoing{},
		&models.Customer{},
		&models.Product{},
		&models.Order{},
		&models.OrderProduct{},
	))
	return db
}
