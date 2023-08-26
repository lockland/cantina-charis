import { faker } from '@faker-js/faker';
import ProductListItem from '../models/ProductListItem';
import Event, { EventType } from '../models/Event';

const fetcher = (url: string, options: any = {}) => {
  return fetch(url, options)
    .then((r) => r.json())
}

export function getOpenEvent() {
  return fetcher("api/events?open=true")
    .then((events) => Event.buildFromData(events[0]))
    .catch(() => new Event)
}

export function createEvent(values: EventType) {
  return fetcher("api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function closeEvent(event_id: number) {
  return fetcher(`api/events/${event_id}/close  `, { method: "PUT" })
}


export function getOrders(total: number): any {
  const list = []

  for (let i = 0; i < total; i++) {
    const order = {
      id: i,
      customer_name: faker.person.fullName(),
      order_amount: getFloatNumber(),
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

export function getCustomerNames(): any {
  // Value is the Customer ID on database
  return {
    data: [
      { value: '1', label: 'Fulano' },
      { value: '2', label: 'Beltrano' },
    ]
  }
}

export function getProductNames(): any {
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
      product_id: i.toString(),
      product_name: faker.commerce.productName(),
      enabled: faker.helpers.arrayElement([true, false]),
      product_price: getFloatNumber(100),
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
      total: getFloatNumber(),
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

function getFloatNumber(max = 10000) {
  return faker.number.float({
    min: 0,
    max: max,
    precision: 0.01
  })
}

export function getEventsSummary(total: number = 5) {

  const amount = getFloatNumber(1000)
  const outgoing = () => {
    const randomNumber = getFloatNumber(500)
    const result = (amount - randomNumber) < 0 ? randomNumber : (amount - randomNumber)

    return parseFloat(result.toFixed(2))
  }
  const list = []

  for (let i = 0; i < total; i++) {
    const event = {
      event_id: i.toString(),
      event_name: faker.helpers.arrayElement(['Culto', 'Culto de mulheres', 'Vigília', 'Dia dos pais']),
      open_amount: amount,
      created_at: faker.date.recent().toLocaleDateString('pt-BR'),
      incoming: getFloatNumber(5000),
      outgoing: outgoing(),
      balance: "0.00",
      liquid_funds: "0.00" //
    }

    event["balance"] = (event.incoming + event.open_amount - event.outgoing).toFixed(2)
    event["liquid_funds"] = (event.incoming - event.outgoing).toFixed(2)

    list.push(event)
  }

  return {
    data: list
  }

}