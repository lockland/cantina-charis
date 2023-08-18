import { createFormContext } from '@mantine/form';
import OrderItemRow from '../models/OrderItemRow';

export interface OrderFormValues {
  customer_id: string,
  products: OrderItemRow[],
  already_paid: boolean
}

export const [FormProvider, useFormContext, useForm] = createFormContext<OrderFormValues>();