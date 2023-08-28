import { createFormContext } from '@mantine/form';
import OrderItemRow from '../models/OrderItemRow';

export interface OrderFormValues {
  customer_name: string,
  products: OrderItemRow[],
}

export const [FormProvider, useFormContext, useForm] = createFormContext<OrderFormValues>();