import DecimalFormatter from "../helpers/Decimal"

export interface ProductType {
  product_id: number,
  product_name: string,
  product_price: number,
  enabled?: boolean,
}

export interface ProductOptionType {
  value: string,
  label: string,
  product_name: string,
  product_price: any
}

class Product {
  constructor(
    public id: number = 0,
    public name: string = "",
    public price: any = "0.00",
    public enabled: boolean = false,
  ) {
    this.id = id
    this.name = name
    this.price = parseFloat(price)
    this.enabled = enabled
  }

  static buildFromData(
    {
      product_id,
      product_name,
      product_price,
      enabled
    }: ProductType
  ): Product {
    return new Product(product_id, product_name, product_price, enabled)
  }

  getFormattedPrice(): string {
    return DecimalFormatter.format(this.price)
  }
}

export default Product
