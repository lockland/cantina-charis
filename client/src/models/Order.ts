import OrderItemRow from "./OrderItemRow";

export interface OrderFormValues {
  customer_name: string,
  products: OrderItemRow[],
}