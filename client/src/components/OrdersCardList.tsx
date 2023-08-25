import { getOrders } from "../hooks/useFakeAPI"
import OrdersCard from "./OrdersCard"
import CustomSimpleGrid from "./CustomSimpleGrid"

interface OrdersCardType {
  customer_name: string,
  order_amount: string,
}

function OrdersCardList() {

  const { data } = getOrders(50)

  return (
    <CustomSimpleGrid m={10} cols={4}>
      {data.map((order: OrdersCardType, index: number) =>
        <OrdersCard
          key={index}
          cname={order.customer_name}
          price={order.order_amount}
        />
      )}
    </CustomSimpleGrid>
  )
}

export default OrdersCardList