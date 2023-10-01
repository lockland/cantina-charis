import DecimalFormatter from "../helpers/Decimal"

export interface DebitOrderType {
  event_name: number,
  order_date: Date,
  order_amount: any,
  paid_value: any,

  getFormattedOrderAmount(): string,
  getFormattedPaidValue(): string,
  getFormattedCreatedAt(): string,
  getFormattedDebitValue(): string

}

export default class DebitOrder implements DebitOrderType {
  constructor(
    public event_name: number,
    public order_date: Date,
    public order_amount: any,
    public paid_value: any,
  ) {
    this.event_name = event_name
    this.order_date = new Date(order_date)
    this.order_amount = parseFloat(order_amount)
    this.paid_value = parseFloat(paid_value)
  }

  static buildFromData({ event_name, order_date, order_amount, paid_value }: DebitOrderType): DebitOrder {
    return new DebitOrder(event_name, order_date, order_amount, paid_value)
  }

  getFormattedOrderAmount(): string {
    return DecimalFormatter.format(this.order_amount)
  }

  getFormattedPaidValue(): string {
    return DecimalFormatter.format(this.paid_value)
  }

  getFormattedCreatedAt(): string {
    return this.order_date.toLocaleDateString('pt-BR')
  }

  getDebitValue(): number {
    return (this.order_amount - this.paid_value)
  }

  getFormattedDebitValue(): string {
    return DecimalFormatter.format(this.getDebitValue())
  }
}

