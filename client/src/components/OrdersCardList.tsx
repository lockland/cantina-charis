import { SimpleGrid } from "@mantine/core"
import { getOrdersHook } from "../hooks/useFakeAPI"
import OrdersCard from "./OrdersCard"

interface OrdersCardType {
  customer_name: string,
  order_price: string,
}

function OrdersCardList() {

  const { data } = getOrdersHook(14)



  return (
    <SimpleGrid cols={3} m={15}>
      {data.map((order: OrdersCardType, index: number) =>
        <OrdersCard
          key={index}
          cname={order.customer_name}
          price={order.order_price}
        />
      )}
    </SimpleGrid>
  )
}

export default OrdersCardList