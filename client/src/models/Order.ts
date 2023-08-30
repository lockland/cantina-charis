import DecimalFormatter from "../helpers/Decimal";
import OrderItemRow from "./OrderItemRow";
import { ProductType } from "./Product";
export interface OrderFormValues {
  event_id: number,
  customer_name: string,
  customer_paid_value: any,
  order_amount: any,
  products: OrderItemRow[],
}

export interface OrdersCardType {
  order_amount: string,
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
  products: ProductType[],

  getFormattedAmount(): string
}


export default class Order implements OrderListItem {
  constructor(
    public order_id: number,
    public order_amount: any,
    public customer: OrderCustomer,
    public products: ProductType[],
  ) {
    this.order_id = order_id
    this.order_amount = parseFloat(order_amount)
    this.customer = customer
    this.products = products
  }

  static buildFromData({ order_id, order_amount, customer, products }: OrderListItem): OrderListItem {
    return new Order(order_id, order_amount, customer, products)
  }

  getFormattedAmount(): string {
    return DecimalFormatter.format(this.order_amount)
  }
}
