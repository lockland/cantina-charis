interface OrderItemType {
  name: string,
  qtd: number,
  price: string,

  getPrice(): string,
  getTotal(): string
}

class OrderItemRow implements OrderItemType {
  name: string
  qtd: number
  price: string

  constructor(name: string, qtd: number, price: string) {
    this.name = name
    this.qtd = qtd
    this.price = price
  }

  getPrice(): string {
    return parseFloat(this.price).toFixed(2)
  }

  getTotal(): string {
    return (parseFloat(this.price) * this.qtd).toFixed(2)
  }


}

export default OrderItemRow