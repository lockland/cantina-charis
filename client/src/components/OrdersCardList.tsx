import { getActiveOrders } from "../hooks/useAPI"
import { useOrdersSocket } from "../hooks/useOrdersSocket"
import OrdersCard from "./OrdersCard"
import OrdersCustomerCard from "./OrdersCustomerCard"
import CustomSimpleGrid from "./CustomSimpleGrid"
import { useCallback, useEffect, useMemo, useState } from "react"
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

  const groupedOrders = useMemo(() => {
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

    return Array.from(groups.values())
  }, [orders])

  const toggleCustomerMerge = (customerId: number) => {
    setMergedCustomerIds((current) =>
      current.includes(customerId)
        ? current.filter((id) => id !== customerId)
        : [...current, customerId]
    )
  }

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useOrdersSocket(eventId, fetchOrders)

  return (
    <CustomSimpleGrid m={10} cols={4}>
      {groupedOrders.flatMap((group) => {
        const isMerged = mergedCustomerIds.includes(group.customer_id)
        const ordersForCustomer = orders.filter((order) => order.customer_id === group.customer_id)

        if (isMerged) {
          return [
            <OrdersCustomerCard
              key={`group-${group.customer_id}`}
              customer_name={group.customer_name}
              orderIds={group.orderIds}
              orderCount={group.orderIds.length}
              totalAmount={group.totalAmount}
              totalPaid={group.totalPaid}
              onPaid={fetchOrders}
              onUnmerge={() => toggleCustomerMerge(group.customer_id)}
            />,
          ]
        }

        return ordersForCustomer.map((order: OrdersCardType, index: number) => (
          <OrdersCard
            key={order.order_id ?? `${group.customer_id}-${index}`}
            orderId={order.order_id ?? 0}
            customer_name={order.customer?.customer_name ?? ""}
            order_amount={String(order.order_amount ?? 0)}
            paid_value={String(order.paid_value ?? 0)}
            observation={order.observation ?? ""}
            deliveried={order.deliveried}
            created_at={order.created_at}
            onPaid={fetchOrders}
            onDeleted={fetchOrders}
            onDelivered={fetchOrders}
            canMerge={group.orderIds.length > 1}
            onMergeCustomer={() => toggleCustomerMerge(group.customer_id)}
          />
        ))
      })}
    </CustomSimpleGrid>
  )
}

export default OrdersCardList
