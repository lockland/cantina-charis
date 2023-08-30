import DecimalFormatter from "../helpers/Decimal"

export interface DebitOrderType {
  event_name: number,
  event_date: Date,
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
    public event_date: Date,
    public order_amount: any,
    public paid_value: any,
  ) {
    this.event_name = event_name
    this.event_date = new Date(event_date)
    this.order_amount = parseFloat(order_amount)
    this.paid_value = parseFloat(paid_value)
  }

  static buildFromData({ event_name, event_date, order_amount, paid_value }: DebitOrderType): DebitOrder {
    return new DebitOrder(event_name, event_date, order_amount, paid_value)
  }

  getFormattedOrderAmount(): string {
    return DecimalFormatter.format(this.order_amount)
  }

  getFormattedPaidValue(): string {
    return DecimalFormatter.format(this.paid_value)
  }

  getFormattedCreatedAt(): string {
    return this.event_date.toLocaleDateString('pt-BR')
  }

  getDebitValue(): number {
    return (this.order_amount - this.paid_value)
  }

  getFormattedDebitValue(): string {
    return DecimalFormatter.format(this.getDebitValue())
  }
}

