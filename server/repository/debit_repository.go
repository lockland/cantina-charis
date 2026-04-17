package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
)

// DebitRepository runs read queries for debit listings.
type DebitRepository struct {
	db *gorm.DB
}

// NewDebitRepository builds a repository bound to db.
func NewDebitRepository(db *gorm.DB) *DebitRepository {
	return &DebitRepository{db: db}
}

// ListCustomersWithOpenOrders returns customers that have at least one unpaid order, with orders preloaded.
func (r *DebitRepository) ListCustomersWithOpenOrders(customers *[]models.Customer) error {
	return r.db.Model(&models.Customer{}).
		Joins(`INNER JOIN orders ON orders.customer_id = customers.id AND CAST(orders.paid_value AS REAL) < CAST(orders.order_amount AS REAL)`).
		Distinct().
		Preload("Orders", func(db *gorm.DB) *gorm.DB {
			return db.Order("created_at asc").
				Where("CAST(paid_value AS REAL) < CAST(order_amount AS REAL)")
		}).
		Preload("Orders.Event").
		Find(customers).Error
}
