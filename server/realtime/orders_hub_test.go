package realtime

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestRegister_invalidEventOrConn_returnsNil(t *testing.T) {
	assert.Nil(t, Register(0, nil))
	assert.Nil(t, Register(-1, nil))
}

func TestUnregister_nilClient_noPanic(t *testing.T) {
	Unregister(1, nil)
}

func TestNotifyOrderCreated_nonPositiveEvent_noPanic(t *testing.T) {
	NotifyOrderCreated(0)
	NotifyOrderCreated(-1)
}

func TestNotifyOrdersChanged_nonPositiveEvent_noPanic(t *testing.T) {
	NotifyOrdersChanged(0)
}
