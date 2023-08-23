import { faker } from '@faker-js/faker';


export function getOrdersHook(total: number): any {
  const list = []

  for (let i = 0; i < total; i++) {
    const order = {
      id: i,
      customer_name: faker.person.fullName(),
      order_price: faker.number.float({
        min: 0,
        max: 100000,
        precision: 0.01
      }),
      products: faker.helpers.arrayElements(
        [
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
          {
            name: faker.commerce.productName(),
            quantity: faker.number.int(10)
          },
        ]
      )
    }

    list.push(order)
  }

  return {
    data: list
  }
}

export function getCustomerNamesHook(): any {
  // Value is the Customer ID on database
  return {
    data: [
      { value: '1', label: 'Fulano' },
      { value: '2', label: 'Beltrano' },
    ]
  }
}

export function getProductNamesHook(): any {
  // Value is the Product ID on database


  return {
    data: [
      { value: '1', label: 'Café - R$ 2.50', price: "2.50" },
      { value: '2', label: 'Bolo - R$ 12.00', price: "12.00" },
    ]
  }
}