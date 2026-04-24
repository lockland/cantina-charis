package controllers

import (
	"io"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v3"
	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/lockland/cantina-charis/server/service"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCustomerController_GetCustomers(t *testing.T) {
	t.Run("given customer when get then json contains name", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		require.NoError(t, db.Create(&models.Customer{Name: "Pat"}).Error)
		ctrl := NewCustomerController(service.NewCustomerService(repository.NewCustomerRepository(db)))
		app := fiber.New()
		app.Get("/", ctrl.GetCustomers)
		req := httptest.NewRequest(fiber.MethodGet, "/", nil)
		resp, err := app.Test(req)
		require.NoError(t, err)
		assert.Equal(t, fiber.StatusOK, resp.StatusCode)
		body, _ := io.ReadAll(resp.Body)
		assert.Contains(t, string(body), "Pat")
	})
}
