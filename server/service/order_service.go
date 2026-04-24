package service

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

// OrderService coordinates order placement; persistence stays on OrderRepository.
type OrderService struct {
	*repository.OrderRepository
	*repository.EventRepository
}

// NewOrderService wraps the order repository.
func NewOrderService(orderRepo *repository.OrderRepository, eventRepo *repository.EventRepository) *OrderService {
	return &OrderService{
		OrderRepository: orderRepo,
		EventRepository: eventRepo,
	}
}

// PlaceOrder ensures the customer exists, then persists the order and lines (merge via models.MergeOrderProductLines in the repository).
func (s *OrderService) PlaceOrder(customerName string, order *models.Order, lines []models.OrderProduct) error {
	// Check if event is open before creating order
	isOpen, err := s.EventRepository.IsOpen(order.EventID)
	if err != nil {
		return err
	}
	if !isOpen {
		return ErrEventClosed
	}

	err = s.FirstOrCreateCustomerByName(customerName, &order.Customer)
	if err != nil {
		return err
	}
	return s.CreateOrderWithLines(order, lines)
}

// PayOrderFull loads the order, rejects if already fully paid, sets paid_value to order_amount, and persists.
func (s *OrderService) PayOrderFull(orderID int) (*models.Order, error) {
	order := &models.Order{}
	if err := s.FindOrderByID(order, orderID); err != nil {
		return nil, err
	}
	if order.PaidValue.GreaterThanOrEqual(order.OrderAmount) {
		return nil, ErrOrderAlreadyFullyPaid
	}
	order.PaidValue = order.OrderAmount
	if err := s.SaveOrder(order); err != nil {
		return nil, err
	}
	return order, nil
}
