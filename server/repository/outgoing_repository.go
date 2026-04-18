package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
)

// OutgoingRepository persists outgoings.
type OutgoingRepository struct {
	db *gorm.DB
}

// NewOutgoingRepository builds a repository bound to db.
func NewOutgoingRepository(db *gorm.DB) *OutgoingRepository {
	return &OutgoingRepository{db: db}
}

// Create inserts a new outgoing row.
func (r *OutgoingRepository) Create(out *models.Outgoing) error {
	return r.db.Create(out).Error
}

// FindAll loads all outgoings.
func (r *OutgoingRepository) FindAll(outgoings *[]models.Outgoing) error {
	return r.db.Find(outgoings).Error
}
