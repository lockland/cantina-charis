package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Order struct {
	ID           int             `json:"order_id"`
	CustomerID   int             `json:"customer_id"`
	EventID      int             `json:"event_id"`
	Deliveried   bool            `json:"deliveried" gorm:"default:false"`
	OrderAmount  decimal.Decimal `json:"order_amount" gorm:"default:0.00"`
	PaidValue    decimal.Decimal `json:"paid_value" gorm:"default:0.00"`
	Observation  string          `json:"observation"`
	Customer     Customer        `json:"customer"`
	Event        Event           `json:"event"`
	OrderProduct []OrderProduct  `json:"order_items"`
	CreatedAt    time.Time       `json:"created_at"`
	UpdatedAt    time.Time       `json:"updated_at"`
}
