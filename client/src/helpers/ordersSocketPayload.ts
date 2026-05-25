export type OrdersSocketPayloadType = "orders_changed" | "order_created"

export type OrdersSocketPayload = {
  type: OrdersSocketPayloadType
  event_id: number
}

export type OrdersSocketHandlers = {
  subscribedEventId: number
  onRefresh: () => void
  onOrderCreated?: () => void
}

const ORDER_MESSAGE_TYPES: OrdersSocketPayloadType[] = ["orders_changed", "order_created"]

function isOrdersSocketPayloadType(value: string): value is OrdersSocketPayloadType {
  return ORDER_MESSAGE_TYPES.includes(value as OrdersSocketPayloadType)
}

function readEventId(value: unknown): number | null {
  if (typeof value !== "number") {
    return null
  }
  if (!Number.isFinite(value)) {
    return null
  }
  return value
}

function readPayloadRecord(raw: string): Record<string, unknown> | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (parsed === null || typeof parsed !== "object") {
    return null
  }
  return parsed as Record<string, unknown>
}

/**
 * Interpreta mensagem JSON do WebSocket de pedidos; rejeita formato inválido.
 */
export function parseOrdersSocketPayload(raw: string): OrdersSocketPayload | null {
  const record = readPayloadRecord(raw)
  if (record === null) {
    return null
  }
  const typeValue = record.type
  const eventIdValue = record.event_id
  if (typeof typeValue !== "string") {
    return null
  }
  if (!isOrdersSocketPayloadType(typeValue)) {
    return null
  }
  const eventId = readEventId(eventIdValue)
  if (eventId === null) {
    return null
  }
  return { type: typeValue, event_id: eventId }
}

function handleOrderCreated(payload: OrdersSocketPayload, handlers: OrdersSocketHandlers): void {
  if (payload.event_id !== handlers.subscribedEventId) {
    return
  }
  handlers.onRefresh()
  const onCreated = handlers.onOrderCreated
  if (onCreated === undefined) {
    return
  }
  onCreated()
}

/**
 * Executa callbacks conforme o tipo de evento (early returns, sem else).
 */
export function applyOrdersSocketPayload(
  payload: OrdersSocketPayload,
  handlers: OrdersSocketHandlers,
): void {
  if (payload.type === "orders_changed") {
    handlers.onRefresh()
    return
  }
  handleOrderCreated(payload, handlers)
}
