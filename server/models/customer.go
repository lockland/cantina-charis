package models

import "github.com/shopspring/decimal"

type Customer struct {
	Id         int             `json:"customer_id"`
	Name       string          `json:"customer_name"`
	DebitValue decimal.Decimal `json:"debit_value"`
}
