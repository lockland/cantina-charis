import { getActiveOrders } from "../hooks/useAPI"
import { useOrdersSocket } from "../hooks/useOrdersSocket"
import OrdersCard from "./OrdersCard"
import OrdersCustomerCard from "./OrdersCustomerCard"
import CustomSimpleGrid from "./CustomSimpleGrid"
import { useCallback, useEffect, useMemo, useState, type ReactElement } from "react"
import { useCookiesHook } from "../hooks/useCookiesHook"
import { OrdersCardType } from "../models/Order"

interface OrderGroup {
  customer_id: number
  customer_name: string
  orderIds: number[]
  totalAmount: number
  totalPaid: number
}

function OrdersCardList() {
  const [orders, setOrders] = useState<OrdersCardType[]>([])
  const [mergedCustomerIds, setMergedCustomerIds] = useState<number[]>([])
  const { eventId } = useCookiesHook()

  const fetchOrders = useCallback(() => {
    getActiveOrders(eventId).then((response: OrdersCardType[]) => {
      setOrders(response)
    })
  }, [eventId])

  const groupByCustomerId = useMemo(() => {
    const groups = new Map<number, OrderGroup>()

    orders.forEach((order) => {
      const customerId = order.customer_id
      const existing = groups.get(customerId)
      const amount = Number(String(order.order_amount ?? 0)) || 0
      const paid = Number(String(order.paid_value ?? 0)) || 0
      const orderId = order.order_id

      const nextGroup: OrderGroup = existing
        ? {
            ...existing,
            orderIds: orderId ? [...existing.orderIds, orderId] : existing.orderIds,
            totalAmount: existing.totalAmount + amount,
            totalPaid: existing.totalPaid + paid,
          }
        : {
            customer_id: customerId,
            customer_name: order.customer?.customer_name ?? "",
            orderIds: orderId ? [orderId] : [],
            totalAmount: amount,
            totalPaid: paid,
          }

      groups.set(customerId, nextGroup)
    })

    return groups
  }, [orders])

  const toggleCustomerMerge = useCallback((customerId: number) => {
    setMergedCustomerIds((current) =>
      current.includes(customerId)
        ? current.filter((id) => id !== customerId)
        : [...current, customerId]
    )
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useOrdersSocket(eventId, fetchOrders)

  const cards = useMemo(() => {
    const mergedEmitted = new Set<number>()
    const nodes: ReactElement[] = []

    for (const order of orders) {
      const customerId = order.customer_id
      const group = groupByCustomerId.get(customerId)
      if (!group) {
        continue
      }

      if (mergedCustomerIds.includes(customerId)) {
        if (mergedEmitted.has(customerId)) {
          continue
        }
        mergedEmitted.add(customerId)
        const productSlices = orders
          .filter((o) => o.customer_id === customerId)
          .map((o) => ({
            orderId: o.order_id ?? 0,
            items: o.order_items ?? [],
          }))
        nodes.push(
          <OrdersCustomerCard
            key={`group-${customerId}`}
            customer_name={group.customer_name}
            orderIds={group.orderIds}
            orderCount={group.orderIds.length}
            totalAmount={group.totalAmount}
            totalPaid={group.totalPaid}
            productSlices={productSlices}
            onPaid={fetchOrders}
            onUnmerge={() => toggleCustomerMerge(customerId)}
          />
        )
        continue
      }

      nodes.push(
        <OrdersCard
          key={order.order_id ?? `ord-${customerId}-${nodes.length}`}
          orderId={order.order_id ?? 0}
          customer_name={order.customer?.customer_name ?? ""}
          order_amount={String(order.order_amount ?? 0)}
          paid_value={String(order.paid_value ?? 0)}
          observation={order.observation ?? ""}
          deliveried={order.deliveried}
          created_at={order.created_at}
          order_items={order.order_items}
          onPaid={fetchOrders}
          onDeleted={fetchOrders}
          onDelivered={fetchOrders}
          canMerge={group.orderIds.length > 1}
          onMergeCustomer={() => toggleCustomerMerge(customerId)}
        />
      )
    }

    return nodes
  }, [orders, groupByCustomerId, mergedCustomerIds, fetchOrders, toggleCustomerMerge])

  return <CustomSimpleGrid m={10} cols={4}>{cards}</CustomSimpleGrid>
}

export default OrdersCardList
