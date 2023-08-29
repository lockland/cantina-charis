package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Customer struct {
	ID         int             `json:"customer_id"`
	Name       string          `json:"customer_name" gorm:"uniqueIndex"`
	DebitValue decimal.Decimal `json:"debit_value" gorm:"default:0.00"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
	Orders     []Order         `json:"orders"`
}
