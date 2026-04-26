package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// EventRepository loads and updates events and nested orders.
type EventRepository struct {
	db *gorm.DB
}

// NewEventRepository builds a repository bound to db.
func NewEventRepository(db *gorm.DB) *EventRepository {
	return &EventRepository{db: db}
}

// ListEvents returns events ordered by created_at desc; when open is non-nil, filters by Open.
func (r *EventRepository) ListEvents(open *bool) ([]models.Event, error) {
	q := r.db.Order("created_at desc")
	if open != nil {
		q = q.Where("Open = ?", *open)
	}
	var events []models.Event
	err := q.Find(&events).Error
	return events, err
}

// FindByID loads a single event by id.
func (r *EventRepository) FindByID(id int, event *models.Event) error {
	return r.db.First(event, id).Error
}

// IsOpen returns true if the event is open.
func (r *EventRepository) IsOpen(eventID int) (bool, error) {
	var event models.Event
	err := r.db.First(&event, eventID).Error
	if err != nil {
		return false, err
	}
	return event.Open, nil
}

// Close sets Open=false for the event.
func (r *EventRepository) Close(id int) error {
	return r.db.Model(&models.Event{ID: id}).Update("Open", false).Error
}

// Create inserts a new event.
func (r *EventRepository) Create(event *models.Event) error {
	return r.db.Create(event).Error
}

// FindOrdersForEvent loads all orders for the event with products and customers.
func (r *EventRepository) FindOrdersForEvent(eventID int) ([]models.Order, error) {
	event := models.Event{ID: eventID}
	err := r.db.
		Preload("Orders").
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event).Error
	if err != nil {
		return nil, err
	}
	return event.Orders, nil
}

// FindOutgoingsByEventID returns outgoings for an event ordered by created_at.
func (r *EventRepository) FindOutgoingsByEventID(eventID int) ([]models.Outgoing, error) {
	var outgoings []models.Outgoing
	err := r.db.Where("event_id = ?", eventID).Order("created_at").Find(&outgoings).Error
	return outgoings, err
}

// FindPendingOrdersForEvent loads orders where deliveried is false.
func (r *EventRepository) FindPendingOrdersForEvent(eventID int) ([]models.Order, error) {
	event := models.Event{ID: eventID}
	err := r.db.
		Preload("Orders", "deliveried = ?", false).
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event).Error
	if err != nil {
		return nil, err
	}
	return event.Orders, nil
}

// FindActiveOrdersForEvent loads orders not delivered or not fully paid.
func (r *EventRepository) FindActiveOrdersForEvent(eventID int) ([]models.Order, error) {
	event := models.Event{ID: eventID}
	err := r.db.
		Preload("Orders", "deliveried = ? OR CAST(paid_value AS REAL) < CAST(order_amount AS REAL)", false).
		Preload("Orders.OrderProduct.Product").
		Preload("Orders.Customer").
		Preload(clause.Associations).
		Find(&event).Error
	if err != nil {
		return nil, err
	}
	return event.Orders, nil
}
