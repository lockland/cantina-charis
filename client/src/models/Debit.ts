import DecimalFormatter from "../helpers/Decimal"
import DebitOrder, { DebitOrderType } from "./DebitOrder"

export interface DebitType {
  customer: {
    id: number,
    name: string
  },
  total: any,
  orders: DebitOrderType[]
}

export default class Debit {
  constructor(
    public customer: { id: number, name: string },
    public total: any,
    public orders: DebitOrderType[] = []

  ) {
    this.customer = customer
    this.total = parseFloat(total)
    this.addOrders(orders)
  }

  addOrders(orders: DebitOrderType[]): void {
    this.orders = orders.map((orderData) => DebitOrder.buildFromData(orderData))
  }

  static buildFromData({ customer, total, orders }: DebitType): Debit {
    return new Debit(customer, total, orders)
  }

  getFormattedTotal(): string {
    return DecimalFormatter.format(this.total)
  }
}