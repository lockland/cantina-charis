package models

import "github.com/shopspring/decimal"

type Customer struct {
	CustomerId   int             `json:"customer_id"`
	CustomerName string          `json:"customer_name"`
	DebitValue   decimal.Decimal `json:"debit_value"`
}
