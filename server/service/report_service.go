package service

import (
	"time"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

// ReportService exposes reporting queries backed by the report repository.
type ReportService struct {
	*repository.ReportRepository
}

// NewReportService builds a service for reports.
func NewReportService(reports *repository.ReportRepository) *ReportService {
	return &ReportService{ReportRepository: reports}
}

// ListEventSummariesWithBalances returns financial summaries with Balance and LiquidFunds computed.
func (s *ReportService) ListEventSummariesWithBalances() ([]repository.EventSummaryRow, error) {
	result, err := s.ListEventSummaries()
	if err != nil {
		return nil, err
	}
	for i := range result {
		result[i].Balance = result[i].OpenAmount.Add(result[i].Incoming).Sub(result[i].Outgoing)
		result[i].LiquidFunds = result[i].Incoming.Sub(result[i].Outgoing)
	}
	return result, nil
}

// OutgoingReportRowsInRange loads outgoings in [from, toEnd) and maps them to report rows.
func (s *ReportService) OutgoingReportRowsInRange(from, toEnd time.Time) ([]models.OutgoingReportRow, error) {
	outgoings, err := s.FindOutgoingsInDateRange(from, toEnd)
	if err != nil {
		return nil, err
	}
	rows := make([]models.OutgoingReportRow, 0, len(outgoings))
	for i := range outgoings {
		rows = append(rows, outgoings[i].ReportRow())
	}
	return rows, nil
}
