import { useEffect, useRef } from "react"

type NewOrderMessage = { type: string; event_id: number }

/**
 * Conecta ao WebSocket e chama onNewOrder quando um novo pedido for cadastrado
 * para o evento atual (eventId).
 */
export function useOrdersSocket(eventId: number, onNewOrder: () => void) {
  const onNewOrderRef = useRef(onNewOrder)
  onNewOrderRef.current = onNewOrder

  useEffect(() => {
    if (!eventId) return

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    const wsUrl = `${protocol}//${window.location.host}/ws`
    const socket = new WebSocket(wsUrl)

    socket.onmessage = (event) => {
      try {
        const data: NewOrderMessage = JSON.parse(event.data)
        const sameEvent = Number(data.event_id) === Number(eventId)
        if (data.type === "new_order" && sameEvent) {
          onNewOrderRef.current()
        }
      } catch {
        // ignora mensagens inválidas
      }
    }

    return () => {
      socket.close()
    }
  }, [eventId])
}
