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

func mergeOrderProducts(orderID, customerID int, lines []models.OrderProduct) []models.OrderProduct {
	out := make([]models.OrderProduct, 0, len(lines))
	indexOf := func(id int) int {
		for i, p := range out {
			if p.ProductID == id {
				return i
			}
		}
		return -1
	}
	for _, el := range lines {
		j := indexOf(el.ProductID)
		if j > -1 {
			out[j].ProductQuantity += el.ProductQuantity
		} else {
			out = append(out, models.OrderProduct{
				OrderID:         orderID,
				CustomerID:      customerID,
				ProductID:       el.ProductID,
				ProductQuantity: el.ProductQuantity,
			})
		}
	}
	return out
}

// CreateOrderWithLines saves the order and merged line items in one transaction, then reloads associations.
func (r *OrderRepository) CreateOrderWithLines(order *models.Order, lines []models.OrderProduct) error {
	tx := r.db.Begin()

	err := tx.Save(order).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	items := mergeOrderProducts(order.ID, order.Customer.ID, lines)
	err = tx.Save(&items).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.
		Preload("OrderProduct.Product").
		Preload(clause.Associations).
		Find(order).Error
	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.Commit().Error
	if err != nil {
		_ = tx.Rollback()
		return err
	}
	return nil
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

	tx := r.db.Begin()
	err = tx.Where("order_id = ?", orderID).Delete(&models.OrderProduct{}).Error
	if err != nil {
		tx.Rollback()
		return 0, err
	}
	err = tx.Delete(order).Error
	if err != nil {
		tx.Rollback()
		return 0, err
	}
	err = tx.Commit().Error
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
