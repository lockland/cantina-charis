package models

import (
	"time"

	"github.com/shopspring/decimal"
)

type Outgoing struct {
	ID          int             `json:"outgoing_id" gorm:"primaryKey"`
	Description string          `json:"outgoing_description" gorm:"type:text;not null;uniqueIndex:idx_event_description_amount"`
	Amount      decimal.Decimal `json:"outgoing_amount" gorm:"type:numeric;default:0.00;uniqueIndex:idx_event_description_amount"`
	CreatedAt   time.Time       `json:"created_at"`
	UpdatedAt   time.Time       `json:"updated_at"`
	EventID     int             `json:"event_id" validate:"required" gorm:"uniqueIndex:idx_event_description_amount"`
	Event       Event           `json:"-"`
}

// OutgoingReportRow é o formato de item retornado pelo relatório de despesas por período.
type OutgoingReportRow struct {
	EventName   string          `json:"event_name"`
	CreatedAt   time.Time       `json:"created_at"`
	Description string          `json:"description"`
	Amount      decimal.Decimal `json:"amount"`
}

func (o *Outgoing) ReportRow() OutgoingReportRow {
	return OutgoingReportRow{
		EventName:   o.Event.Name,
		CreatedAt:   o.CreatedAt,
		Description: o.Description,
		Amount:      o.Amount,
	}
}
