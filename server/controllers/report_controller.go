package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/database"
	"github.com/shopspring/decimal"
)

type ReportController struct{}

func NewReportController() ReportController {
	return ReportController{}
}

func (c *ReportController) GetSummaries(f *fiber.Ctx) error {
	rawQuery := `
	select
		id,
		name,
		created_at,
		open_amount,
		incoming,
		outgoing,
		debits,
		0 as balance,
		0 as liquid_funds
	from
		events
		left join (
			select
				sum(orders.order_amount) as incoming,
				event_id
			from
				orders
			group by
				event_id
		) as incomings
				on incomings.event_id = events.id
		left join (
			select
				sum(amount) as outgoing,
				event_id
			from
				outgoings
			group by
				event_id
		) as outgoings
			on outgoings.event_id = events.id
		left join (
				select
					sum(order_amount) as debits,
					event_id
				from
					orders
				where
					paid_value < order_amount
				group by
					event_id
			) as debits
				on debits.event_id = events.id
		order by created_at desc;
	`

	result := []struct {
		Id          int             `json:"event_id"`
		Name        string          `json:"event_name"`
		CreatedAt   time.Time       `json:"created_at"`
		OpenAmount  decimal.Decimal `json:"open_amount"`
		Incoming    decimal.Decimal `json:"incoming"`
		Outgoing    decimal.Decimal `json:"outgoing"`
		Debits      decimal.Decimal `json:"debits"`
		Balance     decimal.Decimal `json:"balance"`
		LiquidFunds decimal.Decimal `json:"liquid_funds"`
	}{}

	database.Conn.Raw(rawQuery).Scan(&result)

	for index, summary := range result {
		summary.Balance = summary.OpenAmount.Add(summary.Incoming).Sub(summary.Outgoing)
		summary.LiquidFunds = summary.Incoming.Sub(summary.Outgoing)
		result[index] = summary
	}

	return f.JSON(result)
}
