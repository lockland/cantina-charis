import { getOrders } from "../hooks/useAPI"
import OrdersCard from "./OrdersCard"
import CustomSimpleGrid from "./CustomSimpleGrid"
import { useEffect, useState } from "react"
import { useCookiesHook } from "../hooks/useCookiesHook"
import { OrdersCardType } from "../models/Order"



function OrdersCardList() {

  const [orders, setOrders] = useState<OrdersCardType[]>([])
  const { eventId } = useCookiesHook()

  useEffect(() => {
    getOrders(eventId).then((response: OrdersCardType[]) => {
      setOrders(response)
    })

  }, [])


  return (
    <CustomSimpleGrid m={10} cols={3}>
      {orders.map((order: OrdersCardType, index: number) =>
        <OrdersCard
          key={index}
          cname={order.customer.customer_name}
          price={order.order_amount}
        />
      )}
    </CustomSimpleGrid>
  )
}

export default OrdersCardList