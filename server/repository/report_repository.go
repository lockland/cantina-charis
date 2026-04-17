package repository

import (
	"time"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

// EventSummaryRow is one row from the event financial summaries report.
type EventSummaryRow struct {
	Id          int             `json:"event_id"`
	Name        string          `json:"event_name"`
	CreatedAt   time.Time       `json:"created_at"`
	OpenAmount  decimal.Decimal `json:"open_amount"`
	Incoming    decimal.Decimal `json:"incoming"`
	Outgoing    decimal.Decimal `json:"outgoing"`
	Debits      decimal.Decimal `json:"debits"`
	Balance     decimal.Decimal `json:"balance"`
	LiquidFunds decimal.Decimal `json:"liquid_funds"`
}

// BalanceDayRow is one row from the balance-by-day report.
type BalanceDayRow struct {
	Date     string          `json:"date"`
	Incoming decimal.Decimal `json:"incoming"`
	Outgoing decimal.Decimal `json:"outgoing"`
}

// PaymentReportRow is one row from the customer payments report.
type PaymentReportRow struct {
	OrderDate       string          `json:"order_date"`
	PaymentDate     string          `json:"payment_date"`
	ProductName     string          `json:"product_name"`
	ProductPrice    decimal.Decimal `json:"product_price"`
	ProductQuantity int             `json:"product_quantity"`
}

// ReportRepository runs report queries against the database.
type ReportRepository struct {
	db *gorm.DB
}

// NewReportRepository builds a repository bound to db.
func NewReportRepository(db *gorm.DB) *ReportRepository {
	return &ReportRepository{db: db}
}

const summariesSQL = `
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
				sum(order_amount - paid_value) as debits,
				event_id
			from
				orders
			where
				CAST(paid_value AS REAL) < CAST(order_amount AS REAL)
			group by
				event_id
		) as debits
			on debits.event_id = events.id
order by created_at desc;
`

const balanceSQL = `
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

const paymentsSQL = `
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

// ListEventSummaries runs the financial summary query for all events.
func (r *ReportRepository) ListEventSummaries() ([]EventSummaryRow, error) {
	var result []EventSummaryRow
	err := r.db.Raw(summariesSQL).Scan(&result).Error
	return result, err
}

// ListBalanceSinceDay runs the balance report for days on or after fromDate (YYYY-MM-DD).
func (r *ReportRepository) ListBalanceSinceDay(fromDate string) ([]BalanceDayRow, error) {
	var result []BalanceDayRow
	err := r.db.Raw(balanceSQL, fromDate).Scan(&result).Error
	return result, err
}

// ListPaymentsByCustomer returns paid order line items for a customer.
func (r *ReportRepository) ListPaymentsByCustomer(customerID int) ([]PaymentReportRow, error) {
	var result []PaymentReportRow
	err := r.db.Raw(paymentsSQL, customerID).Scan(&result).Error
	return result, err
}

// FindOutgoingsInDateRange loads outgoings in [from, toEnd) with Event preloaded.
func (r *ReportRepository) FindOutgoingsInDateRange(from, toEnd time.Time) ([]models.Outgoing, error) {
	var outgoings []models.Outgoing
	err := r.db.Where("created_at >= ? AND created_at < ?", from, toEnd).
		Preload("Event").
		Order("created_at").
		Find(&outgoings).Error
	return outgoings, err
}
