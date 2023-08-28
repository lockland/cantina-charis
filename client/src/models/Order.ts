import OrderItemRow from "./OrderItemRow";

export interface OrderFormValues {
  customer_name: string,
  customer_paid_value: any,
  products: OrderItemRow[],
}