import { createFormContext } from '@mantine/form';
import { OrderFormValues } from '../models/Order';

export const [FormProvider, useFormContext, useForm] = createFormContext<OrderFormValues>();