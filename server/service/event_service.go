package service

import "github.com/lockland/cantina-charis/server/repository"

// EventService exposes event use cases; persistence lives in the embedded repository.
type EventService struct {
	*repository.EventRepository
}

// NewEventService builds a service backed by the event repository.
func NewEventService(events *repository.EventRepository) *EventService {
	return &EventService{EventRepository: events}
}
