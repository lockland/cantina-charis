package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Outgoing struct {
	ID          int             `json:"outgoing_id"`
	Description string          `json:"outgoing_description"`
	Amount      decimal.Decimal `json:"outgoing_amount" gorm:"default:0.00"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	EventID     int             `json:"event_id" validate:"required"`
	Event       Event
}
