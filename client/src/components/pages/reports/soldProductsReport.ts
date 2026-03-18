export interface SoldProductRow {
  event_name: string
  order_created_at: string
  customer_name: string
  product_name: string
  price: number
  quantity: number
  subtotal: number
}

interface OrderItemForReport {
  quantity?: number
  product?: { product_name?: string; product_price?: unknown }
}

export interface OrderForReport {
  order_amount?: unknown
  created_at: string
  customer?: { customer_name?: string }
  order_items?: OrderItemForReport[]
}

export function buildSoldProductRows(
  orders: OrderForReport[],
  eventName: string
): { rows: SoldProductRow[]; total: number } {
  const rows: SoldProductRow[] = []
  let total = 0
  for (const order of orders) {
    total += parseFloat(String(order.order_amount ?? 0))
    for (const item of order.order_items ?? []) {
      const price = parseFloat(String(item.product?.product_price ?? 0))
      const qty = Number(item.quantity ?? 0)
      rows.push({
        event_name: eventName,
        order_created_at: order.created_at,
        customer_name: order.customer?.customer_name ?? "",
        product_name: item.product?.product_name ?? "",
        price,
        quantity: qty,
        subtotal: price * qty,
      })
    }
  }
  return { rows, total }
}
