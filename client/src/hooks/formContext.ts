import { createFormContext } from "../ui"
import { OrderFormValues } from '../models/Order';

export const [FormProvider, useFormContext, useForm] = createFormContext<OrderFormValues>();