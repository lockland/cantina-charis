package controllers

import (
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/service"
)

type ReportController struct {
	reports *service.ReportService
}

func NewReportController(reports *service.ReportService) ReportController {
	return ReportController{reports: reports}
}

func (c *ReportController) GetSummaries(f *fiber.Ctx) error {
	result, err := c.reports.ListEventSummariesWithBalances()
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return f.JSON(result)
}

func (c *ReportController) GetBalance(f *fiber.Ctx) error {
	lastDays, err := f.ParamsInt("lastDays")
	if err != nil {
		lastDays = 7
	}

	currentTime := time.Now()
	daysAgo := currentTime.Add(time.Hour * -1 * 24 * time.Duration(lastDays))
	result, err := c.reports.ListBalanceSinceDay(daysAgo.Format("2006-01-02"))
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return f.JSON(result)
}

func (c *ReportController) GetPayments(f *fiber.Ctx) error {
	id, err := f.ParamsInt("customer_id")
	if err != nil {
		return f.Status(401).SendString("Invalid id")
	}

	result, err := c.reports.ListPaymentsByCustomer(id)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}

	return f.JSON(result)
}

const dateLayout = "2006-01-02"

func (c *ReportController) GetOutgoingsByDateRange(f *fiber.Ctx) error {
	fromStr, toStr := f.Query("from"), f.Query("to")
	if fromStr == "" || toStr == "" {
		return f.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "query params 'from' and 'to' (YYYY-MM-DD) are required"})
	}
	from, errFrom := time.Parse(dateLayout, fromStr)
	to, errTo := time.Parse(dateLayout, toStr)
	if errFrom != nil || errTo != nil {
		return f.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "datas inválidas; use YYYY-MM-DD"})
	}
	if to.Before(from) {
		return f.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "'to' deve ser >= 'from'"})
	}
	toEnd := to.Add(24 * time.Hour)

	rows, err := c.reports.OutgoingReportRowsInRange(from, toEnd)
	if err != nil {
		return f.Status(fiber.StatusInternalServerError).SendString(err.Error())
	}
	return f.JSON(rows)
}
