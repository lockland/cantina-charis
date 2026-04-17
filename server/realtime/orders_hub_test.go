package realtime

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestOrdersHub(t *testing.T) {
	t.Run("given invalid event or nil conn when register then nil", func(t *testing.T) {
		assert.Nil(t, Register(0, nil))
		assert.Nil(t, Register(-1, nil))
	})

	t.Run("given nil client when unregister then no panic", func(t *testing.T) {
		Unregister(1, nil)
	})

	t.Run("given non positive event when notify order created then no panic", func(t *testing.T) {
		NotifyOrderCreated(0)
		NotifyOrderCreated(-1)
	})

	t.Run("given non positive event when notify orders changed then no panic", func(t *testing.T) {
		NotifyOrdersChanged(0)
	})
}
