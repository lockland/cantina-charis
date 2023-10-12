import DecimalFormatter from "../helpers/Decimal";
import OrderItemRow from "./OrderItemRow";
import { ProductType } from "./Product";
export interface OrderFormValues {
  event_id: number,
  customer_name: string,
  observation: string,
  customer_paid_value: any,
  order_amount: any,
  products: OrderItemRow[],
}

export interface OrdersCardType {
  order_amount: string,
  paid_value: any,
  customer: {
    customer_name: string,
  }
}

interface OrderCustomer {
  customer_name: string,

}
export interface OrderListItem {
  order_id: number,
  order_amount: any,
  customer: OrderCustomer,
  observation: string,
  order_items: ProductType[],

  getFormattedAmount(): string
}

export default class Order implements OrderListItem {
  constructor(
    public order_id: number,
    public order_amount: any,
    public observation: string,
    public customer: OrderCustomer,
    public order_items: ProductType[],
  ) {
    this.order_id = order_id
    this.order_amount = parseFloat(order_amount)
    this.customer = customer
    this.order_items = order_items
  }

  static buildFromData(data: OrderListItem): OrderListItem {
    return new Order(
      data.order_id,
      data.order_amount,
      data.observation,
      data.customer,
      data.order_items
    )
  }

  getFormattedAmount(): string {
    return DecimalFormatter.format(this.order_amount)
  }
}
