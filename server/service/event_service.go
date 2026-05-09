package service

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

// EventService exposes event use cases; persistence lives in the embedded repository.
type EventService struct {
	*repository.EventRepository
	orderRepo *repository.OrderRepository
}

// NewEventService builds a service backed by the event and order repositories.
func NewEventService(events *repository.EventRepository, orderRepo *repository.OrderRepository) *EventService {
	return &EventService{
		EventRepository: events,
		orderRepo:       orderRepo,
	}
}

// FindOrdersForEventWithUndelivered returns event orders merged with undelivered orders from other events.
func (s *EventService) FindOrdersForEventWithUndelivered(eventID int) ([]models.Order, error) {
	eventOrders, err := s.FindOrdersForEvent(eventID)
	if err != nil {
		return nil, err
	}

	undeliveredOrders, err := s.orderRepo.FindUndeliveredOrders()
	if err != nil {
		return nil, err
	}

	// Filter out orders that belong to the current event
	filteredOrders := filterOrdersByEventID(undeliveredOrders, eventID)
	return append(eventOrders, filteredOrders...), nil
}

// FindPendingOrdersForEventWithUndelivered returns pending event orders merged with undelivered orders from other events.
func (s *EventService) FindPendingOrdersForEventWithUndelivered(eventID int) ([]models.Order, error) {
	eventOrders, err := s.FindPendingOrdersForEvent(eventID)
	if err != nil {
		return nil, err
	}

	undeliveredOrders, err := s.orderRepo.FindUndeliveredOrders()
	if err != nil {
		return nil, err
	}

	// Filter out orders that belong to the current event
	filteredOrders := filterOrdersByEventID(undeliveredOrders, eventID)
	return append(eventOrders, filteredOrders...), nil
}

// FindActiveOrdersForEventWithUndelivered returns active event orders merged with undelivered orders from other events.
func (s *EventService) FindActiveOrdersForEventWithUndelivered(eventID int) ([]models.Order, error) {
	eventOrders, err := s.FindActiveOrdersForEvent(eventID)
	if err != nil {
		return nil, err
	}

	undeliveredOrders, err := s.orderRepo.FindUndeliveredOrders()
	if err != nil {
		return nil, err
	}

	// Filter out orders that belong to the current event
	filteredOrders := filterOrdersByEventID(undeliveredOrders, eventID)
	return append(eventOrders, filteredOrders...), nil
}

// filterOrdersByEventID removes orders that belong to the specified eventID.
func filterOrdersByEventID(orders []models.Order, eventID int) []models.Order {
	var filtered []models.Order
	for _, order := range orders {
		if order.EventID != eventID {
			filtered = append(filtered, order)
		}
	}
	return filtered
}
