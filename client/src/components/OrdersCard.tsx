import { Box, Button, CloseButton, Divider, Text, Tooltip } from "@mantine/core"
import { CreditCardIcon, CalendarIcon, CheckIcon } from "@primer/octicons-react"
import { useState } from "react"
import DecimalFormatter from "../helpers/Decimal"
import { payOrder, deleteOrder, deliveryOrder } from "../hooks/useAPI"

interface OrdersCardProps {
  orderId: number
  customer_name: string
  order_amount: string
  paid_value: string
  deliveried?: boolean
  onPaid?: () => void
  onDeleted?: () => void
  onDelivered?: () => void
}

function OrdersCard({ orderId, customer_name, order_amount, paid_value, deliveried, onPaid, onDeleted, onDelivered }: OrdersCardProps) {
  const [loading, setLoading] = useState(false)
  const amount = parseFloat(String(order_amount ?? 0)) || 0
  const paid = parseFloat(String(paid_value ?? 0)) || 0
  const isPaid = paid >= amount

  const handlePay = () => {
    setLoading(true)
    payOrder(orderId)
      .then(() => onPaid?.())
      .finally(() => setLoading(false))
  }

  const handleCancelOrder = () => {
    const value = window.prompt("Digite DELETE para cancelar o pedido.")
    if (value?.trim() === "DELETE") {
      setLoading(true)
      deleteOrder(orderId)
        .then(() => onDeleted?.())
        .finally(() => setLoading(false))
    }
  }

  const handleDelivered = () => {
    setLoading(true)
    deliveryOrder(orderId)
      .then(() => onDelivered?.())
      .finally(() => setLoading(false))
  }

  return (
    <Box
      w="100%"
      bg={isPaid ? "var(--orders-card-paid-background-color)" : "var(--orders-card-background-color)"}
      py={15}
      style={{ position: "relative" }}
    >
      <Box style={{ position: "absolute", top: 8, right: 8 }}>
        <Tooltip label="Cancelar pedido">
          <span>
            <CloseButton
              size="sm"
              disabled={loading}
              onClick={handleCancelOrder}
              aria-label="Cancelar pedido"
            />
          </span>
        </Tooltip>
      </Box>
      <Text align="center" weight={600} style={{ color: "#1a1a1a" }}>{customer_name}</Text>
      <Text align="center" weight={600} size="lg" style={{ color: "#1a1a1a" }}>{DecimalFormatter.format(amount)}</Text>
      <Divider my={10} style={{ borderColor: "rgba(0,0,0,0.12)" }} />
      <Box mt="sm" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {isPaid ? (
          <Tooltip label="Pedido já pago">
            <Button
              disabled
              variant="light"
              color="gray"
              sx={{ color: "#495057", backgroundColor: "#e9ecef" }}
            >
              Já Pago <span style={{ marginLeft: 6, display: "inline-flex", verticalAlign: "middle" }}><CalendarIcon size={18} /></span>
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Registrar pagamento do pedido">
            <Button
              loading={loading}
              onClick={handlePay}
              sx={{
                backgroundColor: "#c92a2a",
                color: "#fff",
                "&:hover": {
                  backgroundColor: "#a61e1e",
                },
              }}
            >
              Pagar <span style={{ marginLeft: 6, display: "inline-flex", verticalAlign: "middle" }}><CreditCardIcon size={18} /></span>
            </Button>
          </Tooltip>
        )}
        {!deliveried && (
          <Tooltip label="Marcar pedido como pronto para entrega">
            <Button
              variant="light"
              color="gray"
              disabled={loading}
              onClick={handleDelivered}
              aria-label="Marcar pedido como pronto para entrega"
              sx={{ color: "#495057", backgroundColor: "#e9ecef", "&:hover": { backgroundColor: "#dee2e6" } }}
            >
              Pronto <span style={{ marginLeft: 6, display: "inline-flex", verticalAlign: "middle" }}><CheckIcon size={18} /></span>
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

export default OrdersCard