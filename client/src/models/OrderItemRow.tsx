interface OrderItemType {
  id: string,
  name: string,
  quantity: number,
  price: number,

  getTotal(): number,
  getFormattedPrice(): string,
  getFormattedTotal(): string
}

class OrderItemRow implements OrderItemType {
  constructor(
    public id: string,
    public name: string,
    public quantity: any,
    public price: any
  ) {
    this.id = id
    this.name = name
    this.quantity = parseInt(quantity)
    this.price = parseFloat(price)
  }

  getFormattedPrice(): string {
    return this.price.toFixed(2)
  }

  getTotal(): number {
    return this.price * this.quantity
  }

  getFormattedTotal(): string {
    return (this.price * this.quantity).toFixed(2)
  }


}

export default OrderItemRow