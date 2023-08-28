import { customerType, CustomerNamesOptionType } from "../models/Customer"

export function buildCustomerNamesList(customers: customerType[]): CustomerNamesOptionType[] {
  const list: CustomerNamesOptionType[] = []
  customers.forEach(
    (customer: customerType) =>
      list.push({
        value: customer.customer_id.toString(),
        label: customer.customer_name
      })
  )
  return list
}