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

function isOrdersSocketPayloadType(value: string): value is OrdersSocketPayloadType {
  if (value === "orders_changed") {
    return true
  }
  return value === "order_created"
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

/**
 * Interpreta mensagem JSON do WebSocket de pedidos; rejeita formato inválido.
 */
export function parseOrdersSocketPayload(raw: string): OrdersSocketPayload | null {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }
  if (parsed === null || typeof parsed !== "object") {
    return null
  }
  const record = parsed as Record<string, unknown>
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

/**
 * Executa callbacks conforme o tipo de evento (early returns, sem else).
 */
export function applyOrdersSocketPayload(
  payload: OrdersSocketPayload,
  handlers: OrdersSocketHandlers,
): void {
  if (payload.event_id !== handlers.subscribedEventId) {
    return
  }
  if (payload.type === "orders_changed") {
    handlers.onRefresh()
    return
  }
  if (payload.type === "order_created") {
    handlers.onRefresh()
    const onCreated = handlers.onOrderCreated
    if (onCreated === undefined) {
      return
    }
    onCreated()
  }
}
