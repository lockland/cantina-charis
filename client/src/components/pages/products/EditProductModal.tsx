import ProductListItem from "../../../models/ProductListItem";
import ProductModal from "./ProductModal";

interface EditModalProps {
  product: ProductListItem
  opened: boolean
  closeModal: any
}

function EditProductModal({ product, opened, closeModal }: EditModalProps) {
  const handleSubmit = (values: any) => {
    console.log(values)
    product.name = values.productName
    product.price = values.productPrice

    closeModal()
  }


  return (
    <ProductModal onSubmit={handleSubmit} product={product} opened={opened} closeModal={closeModal} />
  )
}

export default EditProductModal