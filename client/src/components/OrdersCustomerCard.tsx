import { ActionIcon, Box, Button, Divider, Menu, Text, Tooltip } from "@mantine/core"
import { CreditCardIcon } from "@primer/octicons-react"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import DecimalFormatter from "../helpers/Decimal"
import { payOrder } from "../hooks/useAPI"

interface OrdersCustomerCardProps {
  customer_name: string
  orderIds: number[]
  orderCount: number
  totalAmount: number
  totalPaid: number
  onPaid?: () => void
  onUnmerge?: () => void
}

function OrdersCustomerCard({
  customer_name,
  orderIds,
  orderCount,
  totalAmount,
  totalPaid,
  onPaid,
  onUnmerge,
}: OrdersCustomerCardProps) {
  const [loading, setLoading] = useState(false)
  const isPaid = totalPaid >= totalAmount
  const pendingAmount = Math.max(0, totalAmount - totalPaid)

  const handlePay = async () => {
    setLoading(true)
    try {
      for (const orderId of orderIds) {
        await payOrder(orderId)
      }
      onPaid?.()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao pagar as comandas"
      showNotification({
        title: "Falha ao pagar comandas",
        message,
        color: "red",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      w="100%"
      bg={isPaid ? "var(--orders-card-paid-background-color)" : "var(--orders-card-background-color)"}
      py={15}
      style={{ position: "relative", minWidth: 200 }}
    >
      <Box style={{ position: "absolute", top: 8, right: 8 }}>
        <Menu shadow="sm" width={180} position="bottom-end">
          <Menu.Target>
            <ActionIcon variant="filled" size="lg" color="gray" aria-label="Mais opções do cliente">
              <Text size="lg" style={{ lineHeight: 1 }}>
                ⋮
              </Text>
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            {onUnmerge && <Menu.Item onClick={onUnmerge}>Desagrupar cliente</Menu.Item>}
          </Menu.Dropdown>
        </Menu>
      </Box>

      <Text align="center" weight={600} style={{ color: "#1a1a1a" }}>
        {customer_name}
      </Text>
      <Text align="center" size="sm" color="dimmed" mt="xs">
        {orderCount} pedido{orderCount === 1 ? "" : "s"}
      </Text>
      <Text align="center" weight={600} size="lg" style={{ color: "#1a1a1a" }}>
        {DecimalFormatter.format(totalAmount)}
      </Text>
      <Text align="center" size="sm" color="#470404" mt="xs">
        Pendente {DecimalFormatter.format(pendingAmount)}
      </Text>
      <Divider my={10} style={{ borderColor: "rgba(0,0,0,0.12)" }} />
      <Box style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
        <Tooltip label={isPaid ? "Todas as comandas já estão pagas" : "Registrar pagamento de todas as comandas"}>
          <span>
            <Button
              loading={loading}
              disabled={isPaid || orderIds.length === 0}
              onClick={handlePay}
              aria-label="Registrar pagamento de todas as comandas do cliente"
              bg="red"
              color="red"
              rightIcon={<CreditCardIcon size={18} />}
              fullWidth
              style={{ flex: 1, minWidth: 140 }}
            >
              {isPaid ? "Pago" : "Pagar todas"}
            </Button>
          </span>
        </Tooltip>
      </Box>
    </Box>
  )
}

export default OrdersCustomerCard
