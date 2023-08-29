package models

import (
	"github.com/shopspring/decimal"
)

type Order struct {
	ID           int             `json:"order_id"`
	CustomerID   int             `json:"customer_id"`
	EventID      int             `json:"event_id"`
	Deliveried   bool            `json:"deliveried" gorm:"default:false"`
	OrderAmount  decimal.Decimal `json:"order_amount" gorm:"default:0.00"`
	PaidValue    decimal.Decimal `json:"paid_value" gorm:"default:0.00"`
	Products     []Product       `json:"products" gorm:"many2many:order_products;"`
	Customer     Customer        `json:"customer"`
	Event        Event           `json:"event"`
	OrderProduct []OrderProduct  `json:"order_items"`
}
