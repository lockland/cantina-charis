import { faker } from '@faker-js/faker';


export function getOrdersHook(total: number): any {
  const list = []

  for (let i = 0; i < total; i++) {
    const order = {
      customer_name: faker.person.fullName(),
      order_price: faker.number.float({
        min: 0,
        max: 100000,
        precision: 0.01
      })
    }

    list.push(order)
  }

  return {
    data: list
  }
}

export function getCustomerNamesHook(): any {
  return {
    data: [
      { value: '1', label: 'Fulano' },
      { value: '2', label: 'Beltrano' },
    ]
  }
}

export function getProductNamesHook(): any {

  return {
    data: [
      { value: '1', label: 'Café', price: "2.50" },
      { value: '2', label: 'Bolo', price: "12.00" },
    ]
  }
}