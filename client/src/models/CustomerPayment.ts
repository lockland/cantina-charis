import DecimalFormatter from "../helpers/Decimal"

export default class CustomerPayment {

  constructor(
    public order_date: Date,
    public payment_date: Date,
    public product_name: string,
    public product_price: any,
    public product_quantity: any,
  ) {
    this.order_date = new Date(order_date + "T00:00:00")
    this.payment_date = new Date(payment_date + "T00:00:00")
    this.product_name = product_name
    this.product_price = parseFloat(product_price)
    this.product_quantity = parseInt(product_quantity)
  }

  static buildFromData(data: CustomerPayment): CustomerPayment {
    return new CustomerPayment(
      data.order_date,
      data.payment_date,
      data.product_name,
      data.product_price,
      data.product_quantity,
    )
  }

  getFormattedOrderDate(): string {
    return this.order_date.toLocaleDateString('pt-BR')
  }

  getFormattedPaymentDate(): string {
    return this.payment_date.toLocaleDateString('pt-BR')
  }

  getFormattedPrice() {
    return DecimalFormatter.format(this.product_price)
  }

  getFormattedSubTotal() {
    return DecimalFormatter.format(this.product_price * this.product_quantity)
  }
}
