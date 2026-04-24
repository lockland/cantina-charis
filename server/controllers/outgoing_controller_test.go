package controllers

import (
	"fmt"
	"io"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
	"github.com/lockland/cantina-charis/server/service"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestOutgoingController(t *testing.T) {
	t.Run("given valid outgoing when post then get returns created row", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		ev := models.Event{Name: "Ev", Open: true}
		require.NoError(t, db.Create(&ev).Error)
		ctrl := NewOutgoingController(service.NewOutgoingService(repository.NewOutgoingRepository(db), repository.NewEventRepository(db)))
		app := fiber.New()
		app.Post("/outgoings", ctrl.CreateOutgoing)
		app.Get("/outgoings", ctrl.GetOutgoings)
		payload := fmt.Sprintf(`{"outgoing_description":"milk","outgoing_amount":"2.5","event_id":%d}`, ev.ID)
		post := httptest.NewRequest(fiber.MethodPost, "/outgoings", strings.NewReader(payload))
		post.Header.Set(fiber.HeaderContentType, fiber.MIMEApplicationJSON)
		resp, err := app.Test(post)
		require.NoError(t, err)
		assert.Equal(t, fiber.StatusOK, resp.StatusCode)
		body, _ := io.ReadAll(resp.Body)
		assert.Contains(t, string(body), "outgoing_id")
		get := httptest.NewRequest(fiber.MethodGet, "/outgoings", nil)
		resp2, err := app.Test(get)
		require.NoError(t, err)
		assert.Equal(t, fiber.StatusOK, resp2.StatusCode)
		body2, _ := io.ReadAll(resp2.Body)
		assert.Contains(t, string(body2), "milk")
	})
}
