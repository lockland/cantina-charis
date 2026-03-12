import { useEffect, useRef } from "react"

type NewOrderMessage = { type: string; event_id: number }

const WS_OPEN = 1

/**
 * Conecta ao WebSocket e chama onNewOrder quando um novo pedido for cadastrado
 * ou uma ordem for paga no evento atual (eventId).
 */
export function useOrdersSocket(eventId: number, onNewOrder: () => void) {
  const onNewOrderRef = useRef(onNewOrder)
  onNewOrderRef.current = onNewOrder
  const cancelledRef = useRef(false)

  useEffect(() => {
    if (!eventId) return

    cancelledRef.current = false
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}/api/ws`
    // Auth via cookie only; no credentials in URL
    const socket = new WebSocket(wsUrl)

    socket.onopen = () => {
      if (cancelledRef.current) {
        socket.close()
      }
    }

    socket.onmessage = (event) => {
      if (cancelledRef.current) return
      try {
        const data: NewOrderMessage = JSON.parse(event.data)
        const sameEvent = Number(data.event_id) === Number(eventId)
        if (sameEvent && (data.type === "new_order" || data.type === "order_paid" || data.type === "order_deleted")) {
          onNewOrderRef.current()
        }
      } catch {
        // ignora mensagens inválidas
      }
    }

    return () => {
      cancelledRef.current = true
      if (socket.readyState === WS_OPEN) {
        socket.close()
      }
      // Se ainda CONNECTING, não chama close() aqui (evita erro no console).
      // Ao abrir, onopen verá cancelledRef e fechará o socket.
    }
  }, [eventId])
}
