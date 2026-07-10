import DecimalFormatter from "../helpers/Decimal"

export default class CustomerConsumption {

  constructor(
    public order_date: Date,
    public consumption_date: Date,
    public product_name: string,
    public product_price: any,
    public product_quantity: any,
  ) {
    this.order_date = new Date(order_date)
    this.consumption_date = new Date(consumption_date)
    this.product_name = product_name
    this.product_price = parseFloat(product_price)
    this.product_quantity = parseInt(product_quantity)
  }

  static buildFromData(data: CustomerConsumption): CustomerConsumption {
    return new CustomerConsumption(
      data.order_date,
      data.consumption_date,
      data.product_name,
      data.product_price,
      data.product_quantity,
    )
  }

  getFormattedOrderDate(): string {
    return this.order_date.toLocaleString('pt-BR')
  }

  getFormattedConsumptionDate(): string {
    return this.consumption_date.toLocaleString('pt-BR')
  }

  getFormattedPrice() {
    return DecimalFormatter.format(this.product_price)
  }

  getFormattedSubTotal() {
    return DecimalFormatter.format(this.product_price * this.product_quantity)
  }
}
