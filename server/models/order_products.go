package models

import (
	"github.com/shopspring/decimal"
)

type OrderProduct struct {
	OrderID         int             `json:"order_id" gorm:"primaryKey"`
	CustomerID      int             `json:"customer_id" gorm:"primaryKey"`
	ProductID       int             `json:"product_id" gorm:"primaryKey"`
	ProductQuantity int             `json:"quantity" gorm:"default:0"`
	SubTotal        decimal.Decimal `json:"sub_total" gorm:"default:0.00"`
}
