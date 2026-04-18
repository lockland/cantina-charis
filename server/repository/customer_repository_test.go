package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestCustomerRepository_FindAll(t *testing.T) {
	t.Run("given customers in db when find all then returns all rows", func(t *testing.T) {
		db := testutil.OpenSQLite(t)
		require.NoError(t, db.Create(&models.Customer{Name: "A"}).Error)
		require.NoError(t, db.Create(&models.Customer{Name: "B"}).Error)
		r := NewCustomerRepository(db)
		var got []models.Customer
		require.NoError(t, r.FindAll(&got))
		assert.Len(t, got, 2)
	})
}
