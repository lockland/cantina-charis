import { CustomerType, CustomerNamesOptionType } from "../models/Customer"
import { ProductOptionType, ProductType } from "../models/Product"
import DecimalFormatter from "./Decimal"

export function buildCustomerNamesList(customers: CustomerType[]): CustomerNamesOptionType[] {
  const list: CustomerNamesOptionType[] = []
  customers.forEach(
    (customer: CustomerType) =>
      list.push({
        value: customer.customer_name,
        label: customer.customer_name
      })
  )
  return list
}

export function buildProductsList(products: ProductType[]): ProductOptionType[] {
  const list: ProductOptionType[] = []
  products.forEach(
    (product: ProductType) =>
      list.push({
        value: product.product_id.toString(),
        label: `${product.product_name} - ${DecimalFormatter.format(product.product_price)}`,
        product_name: product.product_name,
        product_price: product.product_price

      })
  )
  return list
}