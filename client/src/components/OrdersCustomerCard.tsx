import { ActionIcon, Box, Button, Card, Divider, Menu, Stack, Text, Tooltip } from "@mantine/core"
import { CreditCardIcon, EllipsisIcon } from "@primer/octicons-react"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import DecimalFormatter from "../helpers/Decimal"
import { ORDERS_CARD_MENU_RAIL_PX, ordersCardMenuActionIconStyles } from "../helpers/ordersCardMenuButtonStyles"
import { payOrder } from "../hooks/useAPI"
import { OrderItemsModal } from "./OrderItemsModal"
import type { OrderProductsSlice } from "./OrderProductsList"

function MenuDotsIcon() {
  return (
    <Box
      component="span"
      style={{
        display: "inline-flex",
        transform: "rotate(90deg)",
        color: "inherit",
      }}
    >
      <EllipsisIcon size={18} fill="currentColor" />
    </Box>
  )
}

interface OrdersCustomerCardProps {
  customer_name: string
  orderIds: number[]
  orderCount: number
  totalAmount: number
  totalPaid: number
  /** Um slice por pedido do grupo (ordem da API). */
  productSlices: OrderProductsSlice[]
  onPaid?: () => void
  onBatchPayStart?: () => void
  onBatchPayEnd?: () => void
  onUnmerge?: () => void
}

function OrdersCustomerCard({
  customer_name,
  orderIds,
  orderCount,
  totalAmount,
  totalPaid,
  productSlices,
  onPaid,
  onBatchPayStart,
  onBatchPayEnd,
  onUnmerge,
}: OrdersCustomerCardProps) {
  const [loading, setLoading] = useState(false)
  const [itemsModalOpen, setItemsModalOpen] = useState(false)
  const isPaid = totalPaid >= totalAmount
  const pendingAmount = Math.max(0, totalAmount - totalPaid)

  const handlePay = async () => {
    setLoading(true)
    onBatchPayStart?.()
    try {
      await Promise.all(orderIds.map((orderId) => payOrder(orderId)))
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
      onBatchPayEnd?.()
    }
  }

  const cardBg = isPaid ? "var(--orders-card-paid-background-color)" : "var(--orders-card-background-color)"
  const dividerColor = isPaid ? "var(--orders-card-divider-on-paid)" : "var(--orders-card-divider-on-teal)"

  return (
    <Card
      w="100%"
      padding={0}
      radius="md"
      shadow="sm"
      withBorder={false}
      style={{
        minWidth: 200,
        backgroundColor: cardBg,
        overflow: "hidden",
      }}
    >
      <Stack spacing={0}>
        <Box
          px="sm"
          pt="xs"
          style={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          <Box style={{ width: ORDERS_CARD_MENU_RAIL_PX, flexShrink: 0 }} aria-hidden />
          <Stack spacing={6} align="center" style={{ flex: 1, minWidth: 0 }}>
            <Text
              ta="center"
              fw={700}
              size="lg"
              style={{ color: isPaid ? "var(--orders-card-paid-ink)" : "var(--orders-card-teal-title-color)" }}
            >
              {customer_name}
            </Text>
            <Text ta="center" size="sm" fw={500} style={{ color: isPaid ? "var(--orders-card-paid-secondary)" : "var(--orders-card-on-teal-secondary)" }}>
              {orderCount} pedido{orderCount === 1 ? "" : "s"}
            </Text>
            <Text ta="center" fw={700} fz="xl" style={{ color: isPaid ? "var(--orders-card-paid-ink)" : "var(--orders-card-on-teal-primary)" }}>
              {DecimalFormatter.format(totalAmount)}
            </Text>
            {!isPaid && (
              <Text ta="center" size="sm" fw={500} style={{ color: "var(--orders-card-on-teal-subtle)" }}>
                Pendente {DecimalFormatter.format(pendingAmount)}
              </Text>
            )}
          </Stack>
          <Box style={{ width: ORDERS_CARD_MENU_RAIL_PX, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
            <Menu shadow="md" width={200} position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  radius="md"
                  aria-label="Mais opções do cliente"
                  styles={ordersCardMenuActionIconStyles(isPaid)}
                >
                  <MenuDotsIcon />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={() => setItemsModalOpen(true)} aria-label="Exibir itens de todas as comandas em um modal">
                  Exibir itens
                </Menu.Item>
                {onUnmerge && <Menu.Item onClick={onUnmerge}>Desagrupar cliente</Menu.Item>}
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Box>

        <OrderItemsModal
          opened={itemsModalOpen}
          onClose={() => setItemsModalOpen(false)}
          title={`Itens — ${customer_name} (${orderCount} pedido${orderCount === 1 ? "" : "s"})`}
          slices={productSlices}
        />

        <Divider my="sm" style={{ borderColor: dividerColor }} />

        <Box px="sm" pb="md">
          <Tooltip label={isPaid ? "Todas as comandas já estão pagas" : "Registrar pagamento de todas as comandas"}>
            <span style={{ display: "block" }}>
              {isPaid ? (
                <Button
                  fullWidth
                  variant="outline"
                  color="dark"
                  disabled
                  uppercase
                  aria-label="Todas as comandas já estão pagas"
                  rightIcon={<CreditCardIcon size={18} />}
                  styles={{
                    root: {
                      borderColor: "rgba(0, 0, 0, 0.18)",
                      color: "var(--orders-card-paid-ink)",
                      backgroundColor: "rgba(255, 255, 255, 0.75)",
                      "&:disabled": {
                        opacity: 1,
                        color: "var(--orders-card-paid-ink)",
                        borderColor: "rgba(0, 0, 0, 0.2)",
                        backgroundColor: "rgba(255, 255, 255, 0.85)",
                      },
                    },
                    label: { overflow: "visible" },
                  }}
                >
                  Pago
                </Button>
              ) : (
                <Button
                  fullWidth
                  loading={loading}
                  disabled={orderIds.length === 0}
                  uppercase
                  onClick={handlePay}
                  aria-label="Registrar pagamento de todas as comandas do cliente"
                  color="red"
                  variant="filled"
                  rightIcon={<CreditCardIcon size={18} />}
                  styles={(theme) => ({
                    root: {
                      backgroundColor: theme.colors.red[8],
                      "&:hover": { backgroundColor: theme.colors.red[9] },
                    },
                    label: { overflow: "visible" },
                  })}
                >
                  Pagar todas
                </Button>
              )}
            </span>
          </Tooltip>
        </Box>
      </Stack>
    </Card>
  )
}

export default OrdersCustomerCard
