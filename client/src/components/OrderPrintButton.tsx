import { Menu, Stack, Text } from "@mantine/core"
import { useEffect, useMemo, useState } from "react"
import { createPortal } from "react-dom"
import DecimalFormatter from "../helpers/Decimal"
import { formatOrderCreatedAt } from "../helpers/formatOrderCreatedAt"
import type { OrderProductsSlice } from "./OrderProductsList"

interface OrderPrintButtonProps {
  customerName: string
  orders: OrderProductsSlice[]
  totalAmount: number
}

interface AggregatedProduct {
  productId: number
  name: string
  quantity: number
}

function aggregateProducts(orders: OrderProductsSlice[]): AggregatedProduct[] {
  const products = new Map<number, AggregatedProduct>()

  orders.forEach(({ items }) => {
    items.forEach((item) => {
      const current = products.get(item.product_id)
      if (current) {
        current.quantity += Number(item.quantity) || 0
      } else {
        products.set(item.product_id, {
          productId: item.product_id,
          name: item.product?.product_name?.trim() || "Produto",
          quantity: Number(item.quantity) || 0,
        })
      }
    })
  })

  return Array.from(products.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" })
  )
}

export function OrderPrintMenuItem({ customerName, orders, totalAmount }: OrderPrintButtonProps) {
  const [isPrinting, setIsPrinting] = useState(false)
  const products = useMemo(() => aggregateProducts(orders), [orders])
  const printClassName = isPrinting
    ? "order-ticket-print order-ticket-print--active"
    : "order-ticket-print"

  useEffect(() => {
    if (!isPrinting) return

    const frame = window.requestAnimationFrame(() => {
      window.print()
      setIsPrinting(false)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [isPrinting])

  return (
    <>
      <Menu.Item onClick={() => setIsPrinting(true)}>Imprimir</Menu.Item>
      {createPortal(
        <section className={printClassName} aria-hidden={!isPrinting}>
          <header className="order-ticket-print__header">
            <Text component="h1" className="order-ticket-print__title">
              COMANDA
            </Text>
            <Text className="order-ticket-print__customer">Cliente: {customerName || "Não informado"}</Text>
            {orders.map((order) => (
              <div className="order-ticket-print__order" key={order.orderId}>
                <Text>Pedido #{order.orderId}</Text>
                {order.createdAt && <Text>{formatOrderCreatedAt(order.createdAt)}</Text>}
                {order.observation && (
                  <Text className="order-ticket-print__observation">Obs.: {order.observation}</Text>
                )}
              </div>
            ))}
          </header>

          <div className="order-ticket-print__divider" />

          <Stack spacing={4} className="order-ticket-print__products">
            {products.length > 0 ? (
              products.map((product) => (
                <div className="order-ticket-print__product" key={product.productId}>
                  <Text className="order-ticket-print__product-name">{product.name}</Text>
                  <Text className="order-ticket-print__quantity">{product.quantity}×</Text>
                </div>
              ))
            ) : (
              <Text>Nenhum item neste pedido.</Text>
            )}
          </Stack>

          <div className="order-ticket-print__divider" />
          <div className="order-ticket-print__total">
            <Text>Total</Text>
            <Text fw={700}>{DecimalFormatter.format(totalAmount)}</Text>
          </div>
        </section>,
        document.body
      )}
    </>
  )
}
