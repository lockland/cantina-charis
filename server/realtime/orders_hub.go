package realtime

import (
	"encoding/json"
	"sync"

	"github.com/gofiber/contrib/websocket"
)

type clientConn struct {
	c  *websocket.Conn
	mu sync.Mutex
}

func (cc *clientConn) writeText(b []byte) error {
	cc.mu.Lock()
	defer cc.mu.Unlock()
	return cc.c.WriteMessage(websocket.TextMessage, b)
}

// OrdersHub fan-out por event_id (um processo).
type OrdersHub struct {
	mu   sync.Mutex
	subs map[int]map[*clientConn]struct{}
}

var defaultHub = &OrdersHub{subs: make(map[int]map[*clientConn]struct{})}

// Register associa uma conexão WebSocket a um evento.
func Register(eventID int, c *websocket.Conn) *clientConn {
	if eventID <= 0 || c == nil {
		return nil
	}
	cc := &clientConn{c: c}
	defaultHub.mu.Lock()
	defer defaultHub.mu.Unlock()
	if defaultHub.subs[eventID] == nil {
		defaultHub.subs[eventID] = make(map[*clientConn]struct{})
	}
	defaultHub.subs[eventID][cc] = struct{}{}
	return cc
}

// Unregister remove a conexão da sala do evento.
func Unregister(eventID int, cc *clientConn) {
	if cc == nil {
		return
	}
	defaultHub.mu.Lock()
	defer defaultHub.mu.Unlock()
	if m, ok := defaultHub.subs[eventID]; ok {
		delete(m, cc)
		if len(m) == 0 {
			delete(defaultHub.subs, eventID)
		}
	}
}

// NotifyOrdersChanged envia um aviso leve para todos os clientes inscritos no evento.
func NotifyOrdersChanged(eventID int) {
	if eventID <= 0 {
		return
	}
	payload, err := json.Marshal(map[string]any{
		"type":     "orders_changed",
		"event_id": eventID,
	})
	if err != nil {
		return
	}
	defaultHub.mu.Lock()
	var list []*clientConn
	if m, ok := defaultHub.subs[eventID]; ok {
		list = make([]*clientConn, 0, len(m))
		for cc := range m {
			list = append(list, cc)
		}
	}
	defaultHub.mu.Unlock()
	for _, cc := range list {
		_ = cc.writeText(payload)
	}
}
