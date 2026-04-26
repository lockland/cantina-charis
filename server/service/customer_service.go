package service

import "github.com/lockland/cantina-charis/server/repository"

// CustomerService exposes customer listing backed by the customer repository.
type CustomerService struct {
	*repository.CustomerRepository
}

// NewCustomerService builds a service for customers.
func NewCustomerService(customers *repository.CustomerRepository) *CustomerService {
	return &CustomerService{CustomerRepository: customers}
}
