package repository

import (
	"testing"

	"github.com/lockland/cantina-charis/server/internal/testutil"
	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestListEvents_openFilterNil_returnsAll(t *testing.T) {
	db := testutil.OpenSQLite(t)
	a := models.Event{Name: "A"}
	b := models.Event{Name: "B"}
	require.NoError(t, db.Create(&a).Error)
	require.NoError(t, db.Create(&b).Error)
	require.NoError(t, db.Model(&b).Update("open", false).Error)

	r := NewEventRepository(db)
	got, err := r.ListEvents(nil)
	require.NoError(t, err)
	assert.Len(t, got, 2)
}

func TestListEvents_openFilterTrue_returnsOnlyOpen(t *testing.T) {
	db := testutil.OpenSQLite(t)
	openEv := models.Event{Name: "OpenEv"}
	closedEv := models.Event{Name: "ClosedEv"}
	require.NoError(t, db.Create(&openEv).Error)
	require.NoError(t, db.Create(&closedEv).Error)
	require.NoError(t, db.Model(&closedEv).Update("open", false).Error)

	r := NewEventRepository(db)
	v := true
	got, err := r.ListEvents(&v)
	require.NoError(t, err)
	require.Len(t, got, 1)
	assert.Equal(t, "OpenEv", got[0].Name)
	assert.True(t, got[0].Open)
}

func TestListEvents_openFilterFalse_returnsOnlyClosed(t *testing.T) {
	db := testutil.OpenSQLite(t)
	openEv := models.Event{Name: "OpenEv2"}
	closedEv := models.Event{Name: "ClosedEv2"}
	require.NoError(t, db.Create(&openEv).Error)
	require.NoError(t, db.Create(&closedEv).Error)
	require.NoError(t, db.Model(&closedEv).Update("open", false).Error)

	r := NewEventRepository(db)
	v := false
	got, err := r.ListEvents(&v)
	require.NoError(t, err)
	require.Len(t, got, 1)
	assert.Equal(t, "ClosedEv2", got[0].Name)
	assert.False(t, got[0].Open)
}
