package repository

import (
	"time"

	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

// OrderRepository persists orders and related rows.
type OrderRepository struct {
	db *gorm.DB
}

// NewOrderRepository builds a repository bound to db (typically database.Conn).
func NewOrderRepository(db *gorm.DB) *OrderRepository {
	return &OrderRepository{db: db}
}

// FirstOrCreateCustomerByName ensures customer exists and fills customer with id.
func (r *OrderRepository) FirstOrCreateCustomerByName(name string, customer *models.Customer) error {
	return r.db.Where(models.Customer{Name: name}).FirstOrCreate(customer).Error
}

// CreateOrderWithLines saves the order and merged line items in one transaction, then reloads associations.
func (r *OrderRepository) CreateOrderWithLines(order *models.Order, lines []models.OrderProduct) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Save(order).Error; err != nil {
			return err
		}
		items := models.MergeOrderProductLines(order.ID, order.Customer.ID, lines)
		if err := tx.Save(&items).Error; err != nil {
			return err
		}
		return tx.
			Preload("OrderProduct.Product").
			Preload(clause.Associations).
			Find(order).Error
	})
}

// ListAllOrders loads all orders with preloads used by the API.
func (r *OrderRepository) ListAllOrders(orders *[]models.Order) error {
	return r.db.
		Preload("OrderProduct.Product").
		Preload(clause.Associations).
		Find(orders).Error
}

// FindOrderByID loads a single order by primary key.
func (r *OrderRepository) FindOrderByID(order *models.Order, id int) error {
	order.ID = id
	return r.db.First(order).Error
}

// SaveOrder persists updates to an existing order.
func (r *OrderRepository) SaveOrder(order *models.Order) error {
	return r.db.Save(order).Error
}

// DeleteOrderWithProducts removes order_products rows then the order inside a transaction.
// Returns the order's event_id for callers that need it after delete.
func (r *OrderRepository) DeleteOrderWithProducts(orderID int) (eventID int, err error) {
	order := &models.Order{ID: orderID}
	err = r.db.First(order).Error
	if err != nil {
		return 0, err
	}
	eventID = order.EventID

	err = r.db.Transaction(func(tx *gorm.DB) error {
		if err := tx.Where("order_id = ?", orderID).Delete(&models.OrderProduct{}).Error; err != nil {
			return err
		}
		return tx.Delete(order).Error
	})
	if err != nil {
		return 0, err
	}
	return eventID, nil
}

// MarkOrderDelivered sets deliveried and done_at; returns event_id for notifications.
func (r *OrderRepository) MarkOrderDelivered(orderID int) (eventID int, err error) {
	var existing models.Order
	err = r.db.Select("id", "event_id").First(&existing, orderID).Error
	if err != nil {
		return 0, err
	}
	err = r.db.Model(&models.Order{ID: orderID}).Updates(models.Order{
		Deliveried: true,
		DoneAt:     time.Now(),
	}).Error
	if err != nil {
		return 0, err
	}
	return existing.EventID, nil
}
