import DecimalFormatter from "../helpers/Decimal"

interface ProductListItemType {
  product_id: string,
  product_name: string,
  product_price: number,
  enabled: boolean,
}

class ProductListItem {
  constructor(
    public id: string = '0',
    public name: string = "",
    public price?: any,
    public enabled: boolean = false,
  ) {
    this.id = id
    this.name = name
    this.price = parseFloat(price)
    this.enabled = enabled
  }

  static buildFromData({ product_id, product_name, product_price, enabled }: ProductListItemType): ProductListItem {
    return new ProductListItem(product_id, product_name, product_price, enabled)
  }

  getFormattedPrice(): string {
    return DecimalFormatter.format(this.price)
  }
}

export default ProductListItem
