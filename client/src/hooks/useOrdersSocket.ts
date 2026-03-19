import { useEffect, useRef } from "react"
import {
  applyOrdersSocketPayload,
  parseOrdersSocketPayload,
} from "../helpers/ordersSocketPayload"

const MAX_RECONNECT_DELAY_MS = 30_000
const BASE_RECONNECT_DELAY_MS = 1000
const MAX_RETRY_EXPONENT = 5

function reconnectDelayMilliseconds(retryCount: number): number {
  const exponent = Math.min(retryCount, MAX_RETRY_EXPONENT)
  const candidate = BASE_RECONNECT_DELAY_MS * 2 ** exponent
  return Math.min(MAX_RECONNECT_DELAY_MS, candidate)
}

function buildOrdersWebSocketUrl(eventId: number): string {
  const pageProtocol = window.location.protocol
  const webSocketProtocol = pageProtocol === "https:" ? "wss:" : "ws:"
  const host = window.location.host
  return `${webSocketProtocol}//${host}/api/ws/orders?event_id=${eventId}`
}

export function useOrdersSocket(
  eventId: number,
  onRefresh: () => void,
  onOrderCreated?: () => void,
) {
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh
  const onOrderCreatedRef = useRef(onOrderCreated)
  onOrderCreatedRef.current = onOrderCreated

  useEffect(() => {
    if (!eventId) {
      return
    }

    let activeSocket: WebSocket | null = null
    let retryCount = 0
    let cancelled = false
    let reconnectTimerId: number | undefined

    const handleIncomingMessage = (event: MessageEvent) => {
      const raw = typeof event.data === "string" ? event.data : ""
      const payload = parseOrdersSocketPayload(raw)
      if (payload === null) {
        return
      }
      applyOrdersSocketPayload(payload, {
        subscribedEventId: eventId,
        onRefresh: () => onRefreshRef.current(),
        onOrderCreated: onOrderCreatedRef.current,
      })
    }

    const scheduleReconnect = () => {
      if (cancelled) {
        return
      }
      const delay = reconnectDelayMilliseconds(retryCount)
      retryCount += 1
      reconnectTimerId = window.setTimeout(connect, delay)
    }

    const connect = () => {
      const url = buildOrdersWebSocketUrl(eventId)
      activeSocket = new WebSocket(url)

      activeSocket.onopen = () => {
        retryCount = 0
      }

      activeSocket.onmessage = handleIncomingMessage

      activeSocket.onclose = () => {
        if (cancelled) {
          return
        }
        scheduleReconnect()
      }

      activeSocket.onerror = () => {
        activeSocket?.close()
      }
    }

    connect()

    return () => {
      cancelled = true
      if (reconnectTimerId !== undefined) {
        window.clearTimeout(reconnectTimerId)
      }
      activeSocket?.close()
    }
  }, [eventId])
}
