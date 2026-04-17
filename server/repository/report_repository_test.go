package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestReportRepository_ListEventSummaries(t *testing.T) {
	t.Run("given empty db when listing then empty slice", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		r := NewReportRepository(db)
		got, err := r.ListEventSummaries()
		require.NoError(t, err)
		assert.Empty(t, got)
	})

	t.Run("given event when listing then summary includes name", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		require.NoError(t, db.Create(&models.Event{Name: "Gala", Open: true}).Error)
		r := NewReportRepository(db)
		got, err := r.ListEventSummaries()
		require.NoError(t, err)
		require.Len(t, got, 1)
		assert.Equal(t, "Gala", got[0].Name)
	})
}
