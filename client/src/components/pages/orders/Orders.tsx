import { Box, Button, Group, Space, Table, Text, Title } from "@mantine/core";
import { deliveryOrder, getOrders } from "../../../hooks/useAPI";
import CustomSimpleGrid from "../../CustomSimpleGrid";
import { useEffect, useState } from "react";
import Order, { OrderListItem } from "../../../models/Order";
import { useCookiesHook } from "../../../hooks/useCookiesHook";
import { ProductType } from "../../../models/Product";
import { useNavigate } from "react-router-dom";

function Orders() {

  const [orders, setOrders] = useState<OrderListItem[]>([])
  const { eventId } = useCookiesHook()
  const navigate = useNavigate()

  useEffect(() => {
    getOrders(eventId).then((response: OrderListItem[]) => {
      setOrders(response.map((orderData) => Order.buildFromData(orderData)))
    })

    setTimeout(() => {
      console.log("Reloading")
      navigate(0)
    }, 60 * 1000)
  }, [])

  const handleOnClick = (id: number) => {
    deliveryOrder(id).then(() => {
      setOrders(orders.filter((order) => order.order_id != id))
    })
  }

  return (
    <CustomSimpleGrid cols={3}>
      {orders.map((order: OrderListItem, index: number) => {
        return (
          <Box key={index}>
            <Box bg="var(--generic-blue)" py="sm">
              <Title order={2} align="center">{order.customer.customer_name}</Title>
              <Text align="center">{order.getFormattedAmount()}</Text>
            </Box>
            <Box bg="var(--generic-blue)" p="sm">
              <Group w="100%" position="right" mb="md">
                <Button onClick={() => handleOnClick(order.order_id)} fullWidth>Pronto</Button>
              </Group>

              <Table striped withColumnBorders bg="var(--secondary-background-color)">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product: ProductType) =>
                    <tr key={product.product_id}>
                      <td>{product.product_name}</td>
                      <td>{product.order_details?.quantity}</td>
                    </tr>
                  )}
                </tbody>
              </Table>
              <Space />
            </Box>
          </Box>
        )
      }
      )}

    </CustomSimpleGrid>
  );
}

export default Orders