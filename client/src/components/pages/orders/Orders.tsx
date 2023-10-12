import { Box, Button, Group, Space, Table, Text, Textarea, Title } from "@mantine/core";
import { deliveryOrder, getOrders } from "../../../hooks/useAPI";
import CustomSimpleGrid from "../../CustomSimpleGrid";
import { useEffect, useState } from "react";
import Order, { OrderListItem } from "../../../models/Order";
import { useCookiesHook } from "../../../hooks/useCookiesHook";
import { ProductType } from "../../../models/Product";

function Orders() {

  const [orders, setOrders] = useState<OrderListItem[]>([])
  const { eventId } = useCookiesHook()

  useEffect(() => {
    getOrders(eventId).then((response: OrderListItem[]) => {
      setOrders(response.map((orderData) => Order.buildFromData(orderData)))
    })
    //@TODO implements a websocket to deal with page refresh
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

              {order.observation && (
                <Box>
                  <Textarea
                    size="md"
                    label="Observações"
                    placeholder="Observações"
                    defaultValue={order.observation}
                    readOnly
                  />

                  <Space mt="xl" />
                </Box>
              )}

              <Table striped withColumnBorders bg="var(--secondary-background-color)">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {order.order_items.map((item: ProductType) =>
                    <tr key={item.product.product_id}>
                      <td>{item.product.product_name}</td>
                      <td>{item.quantity}</td>
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