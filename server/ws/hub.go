package ws

import (
	"sync"

	"github.com/gofiber/contrib/websocket"
)

// Hub mantém as conexões WebSocket ativas e faz broadcast de mensagens.
type Hub struct {
	mu   sync.RWMutex
	conns map[*websocket.Conn]struct{}
}

// DefaultHub é o hub global usado para broadcast (inicializado em config).
var DefaultHub *Hub

// NewHub cria um novo hub.
func NewHub() *Hub {
	return &Hub{
		conns: make(map[*websocket.Conn]struct{}),
	}
}

// Register adiciona uma conexão ao hub.
func (h *Hub) Register(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	h.conns[conn] = struct{}{}
}

// Unregister remove uma conexão do hub.
func (h *Hub) Unregister(conn *websocket.Conn) {
	h.mu.Lock()
	defer h.mu.Unlock()
	delete(h.conns, conn)
}

// Broadcast envia a mensagem para todas as conexões registradas.
func (h *Hub) Broadcast(message []byte) {
	h.mu.RLock()
	defer h.mu.RUnlock()
	for conn := range h.conns {
		_ = conn.WriteMessage(websocket.TextMessage, message)
	}
}
