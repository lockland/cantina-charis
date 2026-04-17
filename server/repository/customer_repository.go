package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
)

// CustomerRepository loads customers.
type CustomerRepository struct {
	db *gorm.DB
}

// NewCustomerRepository builds a repository bound to db.
func NewCustomerRepository(db *gorm.DB) *CustomerRepository {
	return &CustomerRepository{db: db}
}

// FindAll loads every customer row.
func (r *CustomerRepository) FindAll(customers *[]models.Customer) error {
	return r.db.Find(customers).Error
}
