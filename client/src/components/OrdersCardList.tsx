import { getActiveOrders } from "../hooks/useAPI"
import { useOrdersSocket } from "../hooks/useOrdersSocket"
import OrdersCard from "./OrdersCard"
import OrdersCustomerCard from "./OrdersCustomerCard"
import CustomSimpleGrid from "./CustomSimpleGrid"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useCookiesHook } from "../hooks/useCookiesHook"
import { OrdersCardType } from "../models/Order"

interface OrderGroup {
  customer_id: number
  customer_name: string
  orderIds: number[]
  totalAmount: number
  totalPaid: number
  orders: OrdersCardType[]
}

function OrdersCardList() {
  const [orders, setOrders] = useState<OrdersCardType[]>([])
  const [mergedCustomerIds, setMergedCustomerIds] = useState<number[]>([])
  const [batchPayInProgress, setBatchPayInProgress] = useState(false)
  const batchPayInProgressRef = useRef(batchPayInProgress)
  const { eventId } = useCookiesHook()

  const setBatchPayInProgressState = useCallback((value: boolean) => {
    batchPayInProgressRef.current = value
    setBatchPayInProgress(value)
  }, [])

  const fetchOrders = useCallback(() => {
    getActiveOrders(eventId).then((response: OrdersCardType[]) => {
      setOrders(response)
    })
  }, [eventId])

  const refreshOrders = useCallback(() => {
    if (!batchPayInProgressRef.current) {
      fetchOrders()
    }
  }, [fetchOrders])

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
            orders: [...existing.orders, order],
            orderIds: orderId ? [...existing.orderIds, orderId] : existing.orderIds,
            totalAmount: existing.totalAmount + amount,
            totalPaid: existing.totalPaid + paid,
          }
        : {
            customer_id: customerId,
            customer_name: order.customer?.customer_name ?? "",
            orders: [order],
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

  useOrdersSocket(eventId, refreshOrders)

  const renderOrderCard = (order: OrdersCardType, group: OrderGroup, index: number) => (
    <OrdersCard
      key={order.order_id ?? `ord-${group.customer_id}-${index}`}
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
      onMergeCustomer={() => toggleCustomerMerge(group.customer_id)}
    />
  )

  const renderOrderCardsForGroup = (group: OrderGroup) =>
    group.orders.map((order, index) => renderOrderCard(order, group, index))

  const renderMergedCustomerCard = (group: OrderGroup) => {
    const productSlices = group.orders.map((order) => ({
      orderId: order.order_id ?? 0,
      items: order.order_items ?? [],
    }))

    return (
      <OrdersCustomerCard
        key={`group-${group.customer_id}`}
        customer_name={group.customer_name}
        orderIds={group.orderIds}
        orderCount={group.orderIds.length}
        totalAmount={group.totalAmount}
        totalPaid={group.totalPaid}
        productSlices={productSlices}
        onPaid={fetchOrders}
        onBatchPayStart={() => setBatchPayInProgressState(true)}
        onBatchPayEnd={() => setBatchPayInProgressState(false)}
        onUnmerge={() => toggleCustomerMerge(group.customer_id)}
      />
    )
  }

  const cards = useMemo(() => {
    const mergedCustomerIdSet = new Set(mergedCustomerIds)

    return Array.from(groupByCustomerId.values()).flatMap((group) =>
      mergedCustomerIdSet.has(group.customer_id)
        ? [renderMergedCustomerCard(group)]
        : renderOrderCardsForGroup(group)
    )
  }, [groupByCustomerId, mergedCustomerIds, fetchOrders, toggleCustomerMerge])

  return <CustomSimpleGrid m={10} cols={4}>{cards}</CustomSimpleGrid>
}

export default OrdersCardList
