package realtime

import "encoding/json"

type EventID int

func (id EventID) isValid() bool {
	return id > 0
}

type ordersMessageType string

const (
	messageOrderCreated ordersMessageType = "order_created"
	messageOrdersChanged ordersMessageType = "orders_changed"
)

type broadcastAudience int

const (
	audienceEventRoom broadcastAudience = iota
	audienceAllRooms
)

type ordersPayload struct {
	bytes []byte
}

func newOrdersPayload(messageType ordersMessageType, eventID EventID) *ordersPayload {
	raw, err := json.Marshal(map[string]any{
		"type":     string(messageType),
		"event_id": int(eventID),
	})
	if err != nil {
		return nil
	}
	return &ordersPayload{bytes: raw}
}

func (p *ordersPayload) deliverTo(recipients []*clientConn) {
	for _, recipient := range recipients {
		_ = recipient.writeText(p.bytes)
	}
}
