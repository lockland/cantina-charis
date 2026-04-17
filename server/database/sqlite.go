package database

import (
	"log"

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

	migrateDropCustomerDebitColumn(Conn)

	Conn.SetupJoinTable(new(models.Order), "Products", new(models.OrderProduct))
	Conn.SetupJoinTable(new(models.Product), "Orders", new(models.OrderProduct))
}

// migrateDropCustomerDebitColumn removes legacy customers.debit_value (GORM AutoMigrate does not drop columns).
func migrateDropCustomerDebitColumn(db *gorm.DB) {
	type col struct {
		Name string `gorm:"column:name"`
	}
	var cols []col
	if err := db.Raw(`SELECT name FROM pragma_table_info('customers')`).Scan(&cols).Error; err != nil {
		log.Printf("migrateDropCustomerDebitColumn: pragma_table_info: %v", err)
		return
	}
	hasDebit := false
	for _, c := range cols {
		if c.Name == "debit_value" {
			hasDebit = true
			break
		}
	}
	if !hasDebit {
		return
	}
	if err := db.Exec(`ALTER TABLE customers DROP COLUMN debit_value`).Error; err != nil {
		log.Printf("migrateDropCustomerDebitColumn: DROP COLUMN debit_value: %v", err)
	}
}
