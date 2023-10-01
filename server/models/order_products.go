package models

type OrderProduct struct {
	OrderID         int `json:"order_id" gorm:"primaryKey"`
	CustomerID      int `json:"customer_id" gorm:"primaryKey"`
	ProductID       int `json:"product_id" gorm:"primaryKey"`
	ProductQuantity int `json:"quantity" gorm:"default:0"`
}
