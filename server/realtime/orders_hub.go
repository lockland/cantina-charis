package realtime

import (
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
	return defaultHub.register(EventID(eventID), c)
}

// Unregister remove a conexão da sala do evento.
func Unregister(eventID int, cc *clientConn) {
	defaultHub.unregister(EventID(eventID), cc)
}

func (h *OrdersHub) register(eventID EventID, c *websocket.Conn) *clientConn {
	if !eventID.isValid() || c == nil {
		return nil
	}
	client := &clientConn{c: c}
	h.mu.Lock()
	defer h.mu.Unlock()
	if h.subs[int(eventID)] == nil {
		h.subs[int(eventID)] = make(map[*clientConn]struct{})
	}
	h.subs[int(eventID)][client] = struct{}{}
	return client
}

func (h *OrdersHub) unregister(eventID EventID, client *clientConn) {
	if client == nil {
		return
	}
	h.mu.Lock()
	defer h.mu.Unlock()
	room, roomExists := h.subs[int(eventID)]
	if !roomExists {
		return
	}
	delete(room, client)
	if len(room) == 0 {
		delete(h.subs, int(eventID))
	}
}

func (h *OrdersHub) notify(eventID EventID, messageType ordersMessageType, audience broadcastAudience) {
	if !eventID.isValid() {
		return
	}
	payload := newOrdersPayload(messageType, eventID)
	if payload == nil {
		return
	}
	recipients := h.snapshotRecipients(eventID, audience)
	payload.deliverTo(recipients)
}

func (h *OrdersHub) snapshotRecipients(eventID EventID, audience broadcastAudience) []*clientConn {
	h.mu.Lock()
	defer h.mu.Unlock()
	if audience == audienceAllRooms {
		return h.allClients()
	}
	return h.clientsForEvent(eventID)
}

func (h *OrdersHub) allClients() []*clientConn {
	var recipients []*clientConn
	for _, room := range h.subs {
		for client := range room {
			recipients = append(recipients, client)
		}
	}
	return recipients
}

func (h *OrdersHub) clientsForEvent(eventID EventID) []*clientConn {
	room, roomExists := h.subs[int(eventID)]
	if !roomExists {
		return nil
	}
	recipients := make([]*clientConn, 0, len(room))
	for client := range room {
		recipients = append(recipients, client)
	}
	return recipients
}

// NotifyOrderCreated avisa que um pedido novo foi registrado (ex.: notificação na cozinha).
func NotifyOrderCreated(eventID int) {
	defaultHub.notify(EventID(eventID), messageOrderCreated, audienceEventRoom)
}

// NotifyOrdersChanged avisa outras alterações (entrega, exclusão, pagamento, etc.).
func NotifyOrdersChanged(eventID int) {
	defaultHub.notify(EventID(eventID), messageOrdersChanged, audienceAllRooms)
}
