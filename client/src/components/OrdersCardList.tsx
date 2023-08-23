import { getOrdersHook } from "../hooks/useFakeAPI"
import OrdersCard from "./OrdersCard"
import CustomSimpleGrid from "./CustomSimpleGrid"

interface OrdersCardType {
  customer_name: string,
  order_price: string,
}

function OrdersCardList() {

  const { data } = getOrdersHook(50)

  return (
    <CustomSimpleGrid m={15}>
      {data.map((order: OrdersCardType, index: number) =>
        <OrdersCard
          key={index}
          cname={order.customer_name}
          price={order.order_price}
        />
      )}
    </CustomSimpleGrid>
  )
}

export default OrdersCardList