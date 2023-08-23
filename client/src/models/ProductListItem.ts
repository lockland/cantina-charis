
interface ProductListItemType {
  id: string,
  name: string,
  price: number,
  enabled: boolean,
}

class ProductListItem {
  constructor(
    public id: string,
    public name: string,
    public price: any,
    public enabled: boolean = false,
  ) {
    this.id = id
    this.name = name
    this.price = parseFloat(price)
    this.enabled = enabled
  }

  static buildFromData({ id, name, price, enabled }: ProductListItemType): ProductListItem {
    return new ProductListItem(id, name, price, enabled)
  }

  getFormattedPrice(): string {
    return this.price.toFixed(2)
  }
}

export default ProductListItem
