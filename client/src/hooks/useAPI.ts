import Event, { EventType } from '../models/Event';
import { OrderFormValues } from '../models/Order';
import { OutgoingType } from '../models/Outgoing';
import { ProductType } from '../models/Product';

const fetcher = async (url: string, options: any = {}) => {
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

export function closeEvent(eventId: number) {
  return fetcher(`api/events/${eventId}/close  `, { method: "PUT" })
}

export function createOutgoing(values: OutgoingType) {
  return fetcher("api/outgoings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function getCustomerNames() {
  return fetcher("api/customers")
}

export function getEnabledProducts() {
  return fetcher("api/products/enabled")
}

export function createOrder(values: OrderFormValues) {
  return fetcher("api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function getOrders(eventId: number) {
  return fetcher(`api/events/${eventId}/orders`)
}

export function deliveryOrder(orderId: number) {
  return fetcher(`api/orders/${orderId}/done`, { method: "PUT" })
}

export function getProducts() {
  return fetcher("api/products/")
}

export function createProduct(values: ProductType) {
  return fetcher("api/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function toggleProductStatus(productId: number) {
  return fetcher(`api/products/${productId}/toggle`, { method: "PUT" })
}

export function updateProduct(values: ProductType) {
  return fetcher("api/products", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function getDebits() {
  return fetcher("api/debits")
}

export function payDebits(customerId: number) {
  return fetcher(`api/debits/${customerId}/pay`, { method: "PUT" })
}

export function getEventsSummary() {
  return fetcher("api/events/summaries")
}