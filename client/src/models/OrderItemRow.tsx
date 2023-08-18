interface OrderItemType {
  id: string,
  name: string,
  quantity: number,
  price: string,

  getPrice(): string,
  getTotal(): string
}

class OrderItemRow implements OrderItemType {
  id: string
  name: string
  quantity: number
  price: string

  constructor(id: string, name: string, qtd: number, price: string) {
    this.id = id
    this.name = name
    this.quantity = qtd
    this.price = price
  }

  getPrice(): string {
    return parseFloat(this.price).toFixed(2)
  }

  getTotal(): string {
    return (parseFloat(this.price) * this.quantity).toFixed(2)
  }


}

export default OrderItemRow