package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Event struct {
	ID         int             `json:"event_id"`
	Name       string          `json:"event_name"`
	OpenAmount decimal.Decimal `json:"open_amount" gorm:"default:0.00"`
	Open       bool            `json:"is_open" gorm:"default:true"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
}
