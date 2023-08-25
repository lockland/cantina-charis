package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Event struct {
	Id         int             `json:"event_id"`
	Name       string          `json:"event_name"`
	OpenAmount decimal.Decimal `json:"open_mount"`
	Open       bool            `json:"is_open"`
	CreatedAt  time.Time       `json:"created_at"`
}
