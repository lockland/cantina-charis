import Event, { EventType } from '../models/Event';
import { OrderFormValues } from '../models/Order';
import { OutgoingType } from '../models/Outgoing';
import { ProductDetails, ProductType } from '../models/Product';

function throwIfUnauthorized(status: number): void {
  if (status === 401) {
    window.location.reload()
    throw new Error('Unauthorized')
  }
}

const jsonHeaders = { 'Content-Type': 'application/json' }

const fetcher = async (url: string, options: any = {}) => {
  const res = await fetch(url, { ...options, credentials: 'include' as RequestCredentials })
  throwIfUnauthorized(res.status)

  const payload = await res.json()

  if (!res.ok) {
    if (payload?.code === 'EVENT_CLOSED') {
      window.location.href = '/'
      throw new Error(payload.error || 'evento fechado')
    }

    const message = payload?.error || payload?.message || res.statusText
    throw new Error(message)
  }

  return payload
}

function fetcherJson(method: 'POST' | 'PUT', url: string, body: unknown) {
  return fetcher(url, {
    method,
    headers: jsonHeaders,
    body: JSON.stringify(body),
  })
}

export function getAuthMe(): Promise<{ role: string; username: string }> {
  return fetcher('/api/auth/me')
}

export function getOpenEvent(): Promise<Event> {
  return fetcher("/api/events?open=true")
    .then((events: unknown) => {
      if (!Array.isArray(events) || events.length === 0) {
        return new Event()
      }
      return Event.buildFromData(events[0] as EventType)
    })
    .catch(() => new Event())
}

/** All events (open and closed) for comboboxes/reports. */
export function getAllEvents() {
  return fetcher("/api/events")
}

export function createEvent(values: EventType) {
  return fetcherJson('POST', '/api/events', values)
}

export function closeEvent(eventId: number) {
  return fetcher(`/api/events/${eventId}/close`, { method: "PUT" })
}

export function createOutgoing(values: OutgoingType) {
  return fetcherJson('POST', '/api/outgoings', values)
}

export function getOutgoings() {
  return fetcher("/api/outgoings")
}

export function getCustomerNames() {
  return fetcher("/api/customers")
}

export function getEnabledProducts() {
  return fetcher("/api/products/enabled")
}

export function createOrder(values: OrderFormValues) {
  return fetcherJson('POST', '/api/orders', values)
}

export function getOrders(eventId: number) {
  return fetcher(`/api/events/${eventId}/orders`)
}

export function getOutgoingsByEvent(eventId: number) {
  return fetcher(`/api/events/${eventId}/outgoings`)
}

/** Despesas por período (datas inclusivas). from/to em YYYY-MM-DD. */
export function getOutgoingsByDateRange(from: string, to: string) {
  return fetcher(`/api/reports/outgoings?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
}

export function getPendingOrders(eventId: number) {
  return fetcher(`/api/events/${eventId}/orders/pending`)
}

export function getActiveOrders(eventId: number) {
  return fetcher(`/api/events/${eventId}/orders/active`)
}

export function deliveryOrder(orderId: number) {
  return fetcher(`/api/orders/${orderId}/done`, { method: "PUT" })
}

export function getProducts() {
  return fetcher("/api/products/")
}

export function createProduct(values: ProductType) {
  return fetcherJson('POST', '/api/products', values)
}

export function deleteProduct(productId: number) {
  return fetch(`/api/products/${productId}`, { method: "DELETE", credentials: "include" }).then(
    (res) => {
      throwIfUnauthorized(res.status)
      if (res.status === 204 || res.ok) return
      return res.json().then(() => {}, () => {})
    }
  )
}

export function toggleProductStatus(productId: number) {
  return fetcher(`/api/products/${productId}/toggle`, { method: "PUT" })
}

export function updateProduct(values: ProductDetails) {
  return fetcherJson('PUT', '/api/products', values)
}

export function getDebits() {
  return fetcher("/api/debits")
}

export function payDebits(customerId: number, paidValue: number) {
  return fetcherJson('PUT', `/api/debits/${customerId}/pay`, { paid_value: paidValue })
}

export function payOrder(orderId: number) {
  return fetcher(`/api/orders/${orderId}/pay`, {
    method: "PUT",
  })
}

export function deleteOrder(orderId: number) {
  return fetcher(`/api/orders/${orderId}`, {
    method: "DELETE",
  })
}

export function getEventsSummary() {
  return fetcher("/api/reports/summaries")
}

export function getBalance(days: number) {
  return fetcher(`/api/reports/balance/${days}`)
}

export function getCustomerPayments(customerId: string) {
  return fetcher(`/api/reports/payments/${customerId}`)
}
