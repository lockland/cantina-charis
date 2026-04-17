package config

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFiberConfig_errorHandler_sendsPlainText(t *testing.T) {
	app := fiber.New(FiberConfig())
	app.Get("/boom", func(c *fiber.Ctx) error {
		return fiber.NewError(fiber.StatusTeapot, "short and stout")
	})

	req := httptest.NewRequest(fiber.MethodGet, "/boom", nil)
	resp, err := app.Test(req)
	require.NoError(t, err)
	assert.Equal(t, fiber.StatusTeapot, resp.StatusCode)
	assert.Contains(t, resp.Header.Get(fiber.HeaderContentType), "text/plain")
}
