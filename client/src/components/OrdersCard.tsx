import { ActionIcon, Box, Button, Divider, Menu, Text, Tooltip } from "@mantine/core"
import { CreditCardIcon, CalendarIcon, CheckIcon, InfoIcon } from "@primer/octicons-react"
import { useState } from "react"
import DecimalFormatter from "../helpers/Decimal"
import { payOrder, deleteOrder, deliveryOrder } from "../hooks/useAPI"

interface OrdersCardProps {
  orderId: number
  customer_name: string
  order_amount: string
  paid_value: string
  observation?: string
  deliveried?: boolean
  created_at?: string
  onPaid?: () => void
  onDeleted?: () => void
  onDelivered?: () => void
  canMerge?: boolean
  onMergeCustomer?: () => void
}

function OrdersCard({ orderId, customer_name, order_amount, paid_value, observation, deliveried, created_at, onPaid, onDeleted, onDelivered, canMerge, onMergeCustomer }: OrdersCardProps) {
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
      style={{ position: "relative", minWidth: 200 }}
    >
      <Box style={{ position: "absolute", top: 8, right: 8, display: "flex", alignItems: "center" }}>
        <Menu shadow="sm" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="filled" size="lg" color="gray" aria-label="Mais opções do pedido">
              <Text size="lg" style={{ lineHeight: 1 }}>
                ⋮
              </Text>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item color="red" onClick={handleCancelOrder}>
              Excluir pedido
            </Menu.Item>
            {canMerge && onMergeCustomer && (
              <Menu.Item onClick={onMergeCustomer}>Agrupar pedidos do cliente</Menu.Item>
            )}
          </Menu.Dropdown>
        </Menu>
      </Box>
      <Text align="center" weight={600} style={{ color: "#1a1a1a" }}>{customer_name}</Text>
      {created_at && (
        <Text align="center" size="sm" weight={600} color="#14213d">
          Criado em: {new Date(created_at).toLocaleString("pt-BR")}
        </Text>
      )}
      <Text align="center" weight={600} size={"lg"} style={{ color: "#1a1a1a" }}>{DecimalFormatter.format(amount)}</Text>
      {observation && (
        <Box style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <InfoIcon size={12} fill="#470404" />
          <Text align="center" size="md" color="#470404" weight={100} style={{ whiteSpace: "pre-wrap" }}>
            {observation}
          </Text>
        </Box>
      )}
      <Divider my={10} style={{ borderColor: "rgba(0,0,0,0.12)" }} />
      <Box mt="sm" style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 8 }}>
        {isPaid ? (
          <Tooltip label="Pedido já pago">
            <Button
              disabled
              aria-label="Sinalizar que o pedido já está pago"
              rightIcon={<CalendarIcon size={18} />}
            >
              Pago
            </Button>
          </Tooltip>
        ) : (
          <Tooltip label="Registrar pagamento do pedido">
            <Button
              loading={loading}
              onClick={handlePay}
              aria-label="Registrar pagamento do pedido"
              bg="red"
              color="red"
              rightIcon={<CreditCardIcon size={18} />}
            >
              Pagar
            </Button>
          </Tooltip>
        )}
        {!deliveried && (
          <Tooltip label="Marcar pedido como pronto para entrega">
            <Button
              variant="filled"
              color="blue"
              disabled={loading}
              onClick={handleDelivered}
              aria-label="Marcar pedido como pronto para entrega"
              leftIcon={<CheckIcon size={18} />}
            >
              Pronto
            </Button>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}

export default OrdersCard