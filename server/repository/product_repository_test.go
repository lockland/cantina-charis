package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/shopspring/decimal"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestProductRepository(t *testing.T) {
	t.Run("given product when create find toggle then lists reflect enabled flag", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		r := NewProductRepository(db)
		p := &models.Product{Name: "Zeta", Price: decimal.RequireFromString("1.5"), Enabled: true}
		require.NoError(t, r.Create(p))
		require.NotZero(t, p.ID)
		var loaded models.Product
		require.NoError(t, r.FindByID(p.ID, &loaded))
		assert.Equal(t, "Zeta", loaded.Name)
		out, err := r.ToggleEnabled(p.ID)
		require.NoError(t, err)
		assert.False(t, out.Enabled)
		var all []models.Product
		require.NoError(t, r.FindAllOrderedByName(&all))
		require.Len(t, all, 1)
		var enabled []models.Product
		require.NoError(t, r.FindAllEnabledOrdered(&enabled))
		assert.Empty(t, enabled)
	})

	t.Run("given product when delete by id then row removed", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		r := NewProductRepository(db)
		p := &models.Product{Name: "DelP", Price: decimal.RequireFromString("1"), Enabled: true}
		require.NoError(t, r.Create(p))
		n, err := r.DeleteByID(p.ID)
		require.NoError(t, err)
		assert.Equal(t, int64(1), n)
		assert.ErrorIs(t, db.First(&models.Product{}, p.ID).Error, gorm.ErrRecordNotFound)
	})
}
