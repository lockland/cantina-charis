package repository

import (
	"github.com/lockland/cantina-charis/server/models"
	"gorm.io/gorm"
)

// ProductRepository persists products and related order line cleanup.
type ProductRepository struct {
	db *gorm.DB
}

// NewProductRepository builds a repository bound to db.
func NewProductRepository(db *gorm.DB) *ProductRepository {
	return &ProductRepository{db: db}
}

// FindAllOrderedByName loads all products sorted by name.
func (r *ProductRepository) FindAllOrderedByName(products *[]models.Product) error {
	return r.db.Order("Name").Find(products).Error
}

// FindAllEnabledOrdered loads enabled products sorted by name.
func (r *ProductRepository) FindAllEnabledOrdered(products *[]models.Product) error {
	return r.db.Order("Name").Where("enabled = ?", true).Find(products).Error
}

// FindByID loads one product by primary key.
func (r *ProductRepository) FindByID(id int, product *models.Product) error {
	return r.db.First(product, id).Error
}

// ToggleEnabled flips the enabled flag and returns the updated row.
func (r *ProductRepository) ToggleEnabled(id int) (*models.Product, error) {
	var p models.Product
	err := r.db.First(&p, id).Error
	if err != nil {
		return nil, err
	}
	err = r.db.Model(&p).Update("Enabled", !p.Enabled).Error
	if err != nil {
		return nil, err
	}
	p.Enabled = !p.Enabled
	return &p, nil
}

// Create inserts a new product.
func (r *ProductRepository) Create(product *models.Product) error {
	return r.db.Create(product).Error
}

// Update applies non-zero fields from product (expects primary key set).
func (r *ProductRepository) Update(product *models.Product) error {
	return r.db.Model(product).Updates(product).Error
}

// DeleteByID removes order_products referencing the product then the product row.
// Returns rows affected for the product delete (0 if missing).
func (r *ProductRepository) DeleteByID(id int) (productRows int64, err error) {
	tx := r.db.Begin()
	err = tx.Where("product_id = ?", id).Delete(&models.OrderProduct{}).Error
	if err != nil {
		tx.Rollback()
		return 0, err
	}
	res := tx.Delete(&models.Product{}, id)
	if res.Error != nil {
		tx.Rollback()
		return 0, res.Error
	}
	err = tx.Commit().Error
	if err != nil {
		return 0, err
	}
	return res.RowsAffected, nil
}
