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

func (c *ReportController) GetBalance(f *fiber.Ctx) error {
	rawQuery := `
	select
		incoming.date as date,
		incoming,
		outgoing
	from (
		select
			date(created_at, "localtime") as date,
			sum(order_amount) as incoming
		from
			orders
		group by date(created_at, "localtime")
	) as incoming
	left join (
		select
			date(created_at, "localtime") as date,
			sum(amount) as outgoing
		from
			outgoings
		group by
			date(created_at, "localtime")
		) as outgoings
			on incoming.date = outgoings.date
	where
		incoming.date >= ?
	order by
		incoming.date desc;

	`
	result := []struct {
		Date     string          `json:"date"`
		Incoming decimal.Decimal `json:"incoming"`
		Outgoing decimal.Decimal `json:"outgoing"`
	}{}

	lastDays, err := f.ParamsInt("lastDays")

	if err != nil {
		lastDays = 7
	}

	currentTime := time.Now()
	daysAgo := currentTime.Add(time.Hour * -1 * 24 * time.Duration(lastDays))
	database.Conn.Raw(rawQuery, daysAgo.Format("2006-01-02")).Scan(&result)

	return f.JSON(result)
}

func (c *ReportController) GetPayments(f *fiber.Ctx) error {
	rawQuery := `
	select
		c.name as customer_name,
		date(o.created_at) as order_date,
		date(o.updated_at) as payment_date,
		p.name as product_name,
		p.price as product_price,
		op.product_quantity as product_quantity
	from
		orders o
		join order_products op
			on o.id = op.order_id
		join products p
			on p.id = op.product_id
		join customers c on c.id = op.customer_id
	where
		o.paid_value = o.order_amount
		and c.id = ?
	order by
		o.updated_at desc

	`

	id, err := f.ParamsInt("customer_id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	result := []struct {
		OrderDate       string          `json:"order_date"`
		PaymentDate     string          `json:"payment_date"`
		ProductName     string          `json:"product_name"`
		ProductPrice    decimal.Decimal `json:"product_price"`
		ProductQuantity int             `json:"product_quantity"`
	}{}

	database.Conn.Raw(rawQuery, id).Scan(&result)

	return f.JSON(result)

}
