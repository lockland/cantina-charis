import OrderItemRow from "./OrderItemRow";
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
