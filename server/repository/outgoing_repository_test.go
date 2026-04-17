package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestOutgoingRepository_CreateAndFindAll(t *testing.T) {
	db := testutil.OpenSQLite(t)
	ev := models.Event{Name: "E", Open: true}
	require.NoError(t, db.Create(&ev).Error)

	r := NewOutgoingRepository(db)
	o := &models.Outgoing{
		Description: "coffee",
		Amount:      decimal.RequireFromString("3"),
		EventID:     ev.ID,
	}
	require.NoError(t, r.Create(o))
	require.NotZero(t, o.ID)

	var list []models.Outgoing
	require.NoError(t, r.FindAll(&list))
	require.Len(t, list, 1)
	assert.Equal(t, "coffee", list[0].Description)
}
