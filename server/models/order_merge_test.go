package models_test

import (
	"testing"

	"github.com/lockland/cantina-charis/server/models"
	"github.com/stretchr/testify/assert"
)

func TestMergeOrderProductLines_sameProductId_sumsQuantity(t *testing.T) {
	lines := []models.OrderProduct{
		{ProductID: 10, ProductQuantity: 2},
		{ProductID: 10, ProductQuantity: 3},
		{ProductID: 7, ProductQuantity: 1},
	}
	got := models.MergeOrderProductLines(100, 5, lines)
	assert.Len(t, got, 2)
	assert.Equal(t, 100, got[0].OrderID)
	assert.Equal(t, 5, got[0].CustomerID)
	assert.Equal(t, 10, got[0].ProductID)
	assert.Equal(t, 5, got[0].ProductQuantity)
	assert.Equal(t, 7, got[1].ProductID)
	assert.Equal(t, 1, got[1].ProductQuantity)
}

func TestMergeOrderProductLines_emptyInput(t *testing.T) {
	assert.Empty(t, models.MergeOrderProductLines(1, 2, nil))
}
