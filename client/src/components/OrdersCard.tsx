import {
  ActionIcon,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from "@mantine/core"
import {
  CalendarIcon,
  CheckIcon,
  CreditCardIcon,
  EllipsisIcon,
  InfoIcon,
} from "@primer/octicons-react"
import { useState } from "react"
import DecimalFormatter from "../helpers/Decimal"
import { formatOrderCreatedAt } from "../helpers/formatOrderCreatedAt"
import { OrderItemsModal } from "./OrderItemsModal"
import type { ProductType } from "../models/Product"
import { ORDERS_CARD_MENU_RAIL_PX, ordersCardMenuActionIconStyles } from "../helpers/ordersCardMenuButtonStyles"
import { payOrder, deleteOrder, deliveryOrder } from "../hooks/useAPI"

interface OrderCreatedAtProps {
  created_at: string
  isPaid: boolean
}

function OrderCreatedAt({ created_at, isPaid }: OrderCreatedAtProps) {
  const labelStyle = {
    color: isPaid ? "var(--orders-card-paid-secondary)" : "rgba(255, 255, 255, 0.92)",
    textShadow: isPaid ? undefined : "var(--orders-card-on-teal-text-shadow)",
  }

  const valueStyle = {
    color: isPaid ? "var(--orders-card-paid-secondary)" : "rgba(255, 255, 255, 0.92)",
    textShadow: isPaid ? undefined : "var(--orders-card-on-teal-text-shadow)",
    whiteSpace: "nowrap" as const,
  }

  return (
    <Stack spacing={2} align="center">
      <Text ta="center" size="xs" fw={400} lh={1.3} style={labelStyle}>
        Criado em:
      </Text>
      <Text ta="center" size="sm" fw={400} lh={1.3} style={valueStyle}>
        {formatOrderCreatedAt(created_at)}
      </Text>
    </Stack>
  )
}

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

const paidButtonStyles = {
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
}

const violetButtonStyles = (theme: any) => ({
  root: {
    backgroundColor: theme.colors.violet[8],
    "&:hover": { backgroundColor: theme.colors.violet[9] },
  },
  label: { overflow: "visible" },
})

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
  order_items?: ProductType[]
}

function OrdersCard({
  orderId,
  customer_name,
  order_amount,
  paid_value,
  observation,
  deliveried,
  created_at,
  onPaid,
  onDeleted,
  onDelivered,
  canMerge,
  onMergeCustomer,
  order_items,
}: OrdersCardProps) {
  const [loading, setLoading] = useState(false)
  const [itemsModalOpen, setItemsModalOpen] = useState(false)
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

  const cardBg = isPaid ? "var(--orders-card-paid-background-color)" : "var(--orders-card-background-color)"
  const dividerColor = isPaid ? "var(--orders-card-divider-on-paid)" : "var(--orders-card-divider-on-teal)"
  const productSlices = [{ orderId, items: order_items ?? [] }]

  const PaidButton = () => (
    <Tooltip label="Pedido já pago">
      <Button
        fullWidth
        variant="outline"
        color="dark"
        disabled
        uppercase
        aria-label="Sinalizar que o pedido já está pago"
        rightIcon={<CalendarIcon size={18} />}
        styles={paidButtonStyles}
      >
        Pago
      </Button>
    </Tooltip>
  )

  const DeliveredButton = () => (
    <Tooltip label="Marcar pedido como pronto para entrega">
      <Button
        fullWidth
        variant="filled"
        color="violet"
        uppercase
        disabled={loading}
        onClick={handleDelivered}
        aria-label="Marcar pedido como pronto para entrega"
        leftIcon={
          <Group spacing={4} noWrap>
            <CheckIcon size={18} />
          </Group>
        }
        styles={violetButtonStyles}
      >
        Pronto
      </Button>
    </Tooltip>
  )

  const renderActionButtons = () => {
    if (isPaid) {
      return (
        <Stack spacing="xs">
          <PaidButton />
          {!deliveried && <DeliveredButton />}
        </Stack>
      )
    }

    return (
      <Stack spacing="xs">
        <Tooltip label="Registrar pagamento do pedido">
          <Button
            fullWidth
            loading={loading}
            uppercase
            onClick={handlePay}
            aria-label="Registrar pagamento do pedido"
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
            Pagar
          </Button>
        </Tooltip>
        {!deliveried && <DeliveredButton />}
      </Stack>
    )
  }

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
          <Stack spacing={4} align="center" style={{ flex: 1, minWidth: 0 }}>
            <Text
              ta="center"
              fw={700}
              size="md"
              style={{ color: isPaid ? "var(--orders-card-paid-ink)" : "var(--orders-card-teal-title-color)" }}
            >
              {customer_name}
            </Text>
            {created_at && <OrderCreatedAt created_at={created_at} isPaid={isPaid} />}
            <Text ta="center" fw={700} fz="xl" style={{ color: isPaid ? "var(--orders-card-paid-ink)" : "var(--orders-card-on-teal-primary)" }}>
              {DecimalFormatter.format(amount)}
            </Text>
            {observation && (
              <Group spacing={6} position="center" noWrap>
                <InfoIcon size={12} fill={isPaid ? "#470404" : "rgba(255,230,200,0.95)"} />
                <Text
                  ta="center"
                  size="sm"
                  fw={500}
                  style={{
                    color: isPaid ? "#470404" : "rgba(255, 230, 200, 0.95)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {observation}
                </Text>
              </Group>
            )}
          </Stack>
          <Box style={{ width: ORDERS_CARD_MENU_RAIL_PX, flexShrink: 0, display: "flex", justifyContent: "flex-end" }}>
            <Menu shadow="md" width={200} position="bottom-end" withinPortal>
              <Menu.Target>
                <ActionIcon
                  variant="transparent"
                  size="lg"
                  radius="md"
                  aria-label="Mais opções do pedido"
                  styles={ordersCardMenuActionIconStyles(isPaid)}
                >
                  <MenuDotsIcon />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item color="red" onClick={handleCancelOrder}>
                  Excluir pedido
                </Menu.Item>
                <Menu.Item onClick={() => setItemsModalOpen(true)} aria-label="Exibir itens do pedido em um modal">
                  Exibir itens
                </Menu.Item>
                {canMerge && onMergeCustomer && (
                  <Menu.Item onClick={onMergeCustomer}>Agrupar pedidos do cliente</Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </Box>
        </Box>

        <OrderItemsModal
          opened={itemsModalOpen}
          onClose={() => setItemsModalOpen(false)}
          title={`Itens — ${customer_name}`}
          slices={productSlices}
        />

        <Divider my="sm" style={{ borderColor: dividerColor }} />

        <Box px="sm" pb="md">{renderActionButtons()}</Box>
      </Stack>
    </Card>
  )
}

export default OrdersCard
