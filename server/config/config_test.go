package config

import (
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestFiberConfig(t *testing.T) {
	t.Run("given fiber error when request then plain text body and status from error", func(t *testing.T) {
		app := fiber.New(FiberConfig())
		app.Get("/boom", func(c fiber.Ctx) error {
			return fiber.NewError(fiber.StatusTeapot, "short and stout")
		})
		req := httptest.NewRequest(fiber.MethodGet, "/boom", nil)
		resp, err := app.Test(req)
		require.NoError(t, err)
		assert.Equal(t, fiber.StatusTeapot, resp.StatusCode)
		assert.Contains(t, resp.Header.Get(fiber.HeaderContentType), "text/plain")
	})
}
