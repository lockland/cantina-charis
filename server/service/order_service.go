package service

import (
	"github.com/lockland/cantina-charis/server/models"
	"github.com/lockland/cantina-charis/server/repository"
)

// OrderService coordinates order placement; persistence stays on OrderRepository.
type OrderService struct {
	*repository.OrderRepository
}

// NewOrderService wraps the order repository.
func NewOrderService(repo *repository.OrderRepository) *OrderService {
	return &OrderService{OrderRepository: repo}
}

// PlaceOrder ensures the customer exists, then persists the order and lines (merge via models.MergeOrderProductLines in the repository).
func (s *OrderService) PlaceOrder(customerName string, order *models.Order, lines []models.OrderProduct) error {
	err := s.FirstOrCreateCustomerByName(customerName, &order.Customer)
	if err != nil {
		return err
	}
	return s.CreateOrderWithLines(order, lines)
}
