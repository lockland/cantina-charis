import { faker } from '@faker-js/faker';
import ProductListItem from '../models/ProductListItem';


export function getOrdersHook(total: number): any {
  const list = []

  for (let i = 0; i < total; i++) {
    const order = {
      id: i,
      customer_name: faker.person.fullName(),
      order_amount: faker.number.float({
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

  const resp = [
    { id: '1', name: "Café", price: "2.50" },
    { id: '2', name: "Bolo", price: "12.00" },
  ]

  return {
    data: resp.map((el) => {
      return { value: el.id, label: `${el.name} - R$ ${el.price}`, name: el.name, price: el.price }
    })
  }
}

export function getProducts(total: number) {
  const list = []

  for (let i = 0; i < total; i++) {
    const product = ProductListItem.buildFromData({
      id: i.toString(),
      name: faker.commerce.productName(),
      enabled: faker.helpers.arrayElement([true, false]),
      price: faker.number.float({
        min: 0,
        max: 100,
        precision: 0.01
      }),
    })

    list.push(product)
  }

  return {
    data: list
  }
}

export function getDebits(total: number) {
  const list = []

  for (let i = 0; i < total; i++) {
    const debit = {
      customer: {
        id: i.toString(),
        name: faker.person.fullName(),
      },
      total: faker.number.float({
        min: 0,
        max: 100000,
        precision: 0.01
      }),
      orders: faker.helpers.arrayElements([
        {
          event_name: faker.commerce.productName(),
          date: faker.date.recent().toLocaleDateString('pt-BR'),
          total: faker.finance.accountNumber(5),
          paid_value: faker.number.int(50)
        },
        {
          event_name: faker.commerce.productName(),
          date: faker.date.recent().toLocaleDateString('pt-BR'),
          total: faker.finance.accountNumber(5),
          paid_value: faker.number.int(50)
        },
        {
          event_name: faker.commerce.productName(),
          date: faker.date.recent().toLocaleDateString('pt-BR'),
          total: faker.finance.accountNumber(5),
          paid_value: faker.number.int(50)
        },
        {
          event_name: faker.commerce.productName(),
          date: faker.date.recent().toLocaleDateString('pt-BR'),
          total: faker.finance.accountNumber(5),
          paid_value: faker.number.int(50)
        },
      ])
    }

    list.push(debit)
  }

  return {
    data: list
  }
}