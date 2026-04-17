package testutil

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestOpenSQLite_migratesCustomersTable(t *testing.T) {
	db := OpenSQLite(t)
	var name string
	err := db.Raw(`SELECT name FROM sqlite_master WHERE type='table' AND name='customers'`).Scan(&name).Error
	require.NoError(t, err)
	assert.Equal(t, "customers", name)
}
