import { useEffect, useRef } from "react"

export function useOrdersSocket(eventId: number, onRefresh: () => void) {
  const onRefreshRef = useRef(onRefresh)
  onRefreshRef.current = onRefresh

  useEffect(() => {
    if (!eventId) return

    let ws: WebSocket | null = null
    let retry = 0
    let cancelled = false
    let reconnectTimer: number | undefined

    const connect = () => {
      const proto = window.location.protocol === "https:" ? "wss:" : "ws:"
      const url = `${proto}//${window.location.host}/api/ws/orders?event_id=${eventId}`
      ws = new WebSocket(url)

      ws.onopen = () => {
        retry = 0
      }

      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data as string) as { type?: string; event_id?: number }
          if (msg?.type === "orders_changed" && Number(msg.event_id) === eventId) {
            onRefreshRef.current()
          }
        } catch {
          /* ignore malformed */
        }
      }

      ws.onclose = () => {
        if (cancelled) return
        const delay = Math.min(30_000, 1000 * 2 ** Math.min(retry, 5))
        retry += 1
        reconnectTimer = window.setTimeout(connect, delay)
      }

      ws.onerror = () => {
        ws?.close()
      }
    }

    connect()
    return () => {
      cancelled = true
      if (reconnectTimer !== undefined) window.clearTimeout(reconnectTimer)
      ws?.close()
    }
  }, [eventId])
}
