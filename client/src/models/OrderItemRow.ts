import DecimalFormatter from "../helpers/Decimal"

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
  private total: any

  constructor(
    public id: any,
    public name: string,
    public quantity: any,
    public price: any,
  ) {
    this.id = parseInt(id)
    this.name = name
    this.quantity = parseInt(quantity)
    this.price = parseFloat(price)
    this.total = this.price * this.quantity
  }

  getFormattedPrice(): string {
    return DecimalFormatter.format(this.price)
  }

  getTotal(): number {
    return this.total
  }

  getFormattedTotal(): string {
    return DecimalFormatter.format(this.total)
  }


}

export default OrderItemRow