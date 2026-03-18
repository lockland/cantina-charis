import { getActiveOrders } from "../hooks/useAPI"
import OrdersCard from "./OrdersCard"
import CustomSimpleGrid from "./CustomSimpleGrid"
import { useCallback, useEffect, useState } from "react"
import { useCookiesHook } from "../hooks/useCookiesHook"
import { OrdersCardType } from "../models/Order"

function OrdersCardList() {
  const [orders, setOrders] = useState<OrdersCardType[]>([])
  const { eventId } = useCookiesHook()

  const fetchOrders = useCallback(() => {
    getActiveOrders(eventId).then((response: OrdersCardType[]) => {
      setOrders(response)
    })
  }, [eventId])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])


  return (
    <CustomSimpleGrid m={10} cols={4}>
      {orders.map((order: OrdersCardType, index: number) =>
        <OrdersCard
          key={order.order_id ?? index}
          orderId={order.order_id ?? 0}
          customer_name={order.customer?.customer_name ?? ""}
          order_amount={String(order.order_amount ?? 0)}
          paid_value={String(order.paid_value ?? 0)}
          deliveried={order.deliveried}
          onPaid={fetchOrders}
          onDeleted={fetchOrders}
          onDelivered={fetchOrders}
        />
      )}
    </CustomSimpleGrid>
  )
}

export default OrdersCardList