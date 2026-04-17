package models

import (
	"time"
)

type Customer struct {
	ID        int       `json:"customer_id"`
	Name      string    `json:"customer_name" gorm:"uniqueIndex"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Orders    []Order   `json:"orders"`
}
