package controllers

import (
	"errors"
	"strconv"

	"github.com/gofiber/fiber/v3"
	"github.com/lockland/cantina-charis/server/service"
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
)

func eventIDFromQuery(ctx fiber.Ctx) (int, bool) {
	eventID, err := strconv.Atoi(ctx.Query("event_id"))
	if err != nil {
		return 0, false
	}
	if eventID <= 0 {
		return 0, false
	}
	return eventID, true
}

func orderIDFromParams(ctx fiber.Ctx) (int, bool) {
	orderID := fiber.Params[int](ctx, "id")
	return orderID, orderID > 0
}

func respondInvalidEventID(ctx fiber.Ctx) error {
	return ctx.Status(fiber.StatusBadRequest).SendString("Invalid or missing event_id")
}

func respondInvalidOrderID(ctx fiber.Ctx) error {
	return ctx.Status(fiber.StatusBadRequest).SendString("Invalid order id")
}

func respondInvalidID(ctx fiber.Ctx) error {
	return ctx.Status(fiber.StatusBadRequest).SendString("Invalid id")
}

func respondOrderNotFound(ctx fiber.Ctx) error {
	return ctx.Status(fiber.StatusNotFound).SendString("Order not found")
}

func respondOrderMutationError(ctx fiber.Ctx, err error) error {
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return respondOrderNotFound(ctx)
	}
	if errors.Is(err, service.ErrOrderAlreadyFullyPaid) {
		return ctx.Status(fiber.StatusBadRequest).SendString("Order already paid")
	}
	return ctx.Status(fiber.StatusInternalServerError).SendString(err.Error())
}

func paidValueCapped(customerPaid, orderAmount decimal.Decimal) decimal.Decimal {
	if customerPaid.GreaterThan(orderAmount) {
		return orderAmount
	}
	return customerPaid
}
