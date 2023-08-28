import Product, { ProductType } from "../../../models/Product";
import ProductModal from "./ProductModal";

interface EditModalProps {
  product: Product
  opened: boolean
  closeModal: any
}

function EditProductModal({ product, opened, closeModal }: EditModalProps) {
  const handleSubmit = (values: ProductType) => {
    console.log(values)
    product.name = values.product_name
    product.price = values.product_price

    closeModal()
  }


  return (
    <ProductModal
      modalTitle="Editar produto"
      onSubmit={handleSubmit}
      product={product}
      opened={opened}
      closeModal={closeModal}
    />
  )
}

export default EditProductModal