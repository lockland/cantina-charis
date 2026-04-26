package service

import "github.com/lockland/cantina-charis/server/repository"

// ProductService exposes product operations backed by the product repository.
type ProductService struct {
	*repository.ProductRepository
}

// NewProductService builds a service for products.
func NewProductService(products *repository.ProductRepository) *ProductService {
	return &ProductService{ProductRepository: products}
}
