package models

import "github.com/shopspring/decimal"

type Product struct {
	ID           int             `json:"product_id"`
	Name         string          `json:"product_name" gorm:"uniqueIndex"`
	Price        decimal.Decimal `json:"product_price" gorm:"default:0.00"`
	Enabled      bool            `json:"enabled" gorm:"default:false"`
	OrderProduct OrderProduct    `json:"order_details"`
}
