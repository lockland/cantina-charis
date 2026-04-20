import { Box, Button, Group, Space, Table, Text, Textarea, Title } from "@mantine/core";
import { deliveryOrder, getPendingOrders } from "../../../hooks/useAPI";
import { useOrdersSocket } from "../../../hooks/useOrdersSocket";
import {
  notifyNewOrderFromCashRegister,
  primeKitchenAudioFromUserGesture,
} from "../../../helpers/newOrderKitchenSignal";
import CustomSimpleGrid from "../../CustomSimpleGrid";
import { useCallback, useEffect, useState } from "react";
import Order, { OrderListItem } from "../../../models/Order";
import { ProductType } from "../../../models/Product";
import { useSharedContext } from "../../../hooks/useSharedContext";

function Orders() {
  const [orders, setOrders] = useState<OrderListItem[]>([])
  const { openEvent, openEventHydrated } = useSharedContext()
  const eventId = openEvent.event_id

  const fetchOrders = useCallback(() => {
    if (!openEventHydrated || eventId <= 0) {
      return
    }
    getPendingOrders(eventId).then((response: OrderListItem[]) => {
      setOrders(response.map((orderData) => Order.buildFromData(orderData)))
    })
  }, [eventId, openEventHydrated])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  useEffect(() => {
    const unlock = () => {
      primeKitchenAudioFromUserGesture()
    }
    window.addEventListener("pointerdown", unlock)
    return () => window.removeEventListener("pointerdown", unlock)
  }, [])

  useOrdersSocket(eventId, fetchOrders, notifyNewOrderFromCashRegister)

  const handleOnClick = (id: number) => {
    deliveryOrder(id).then(() => fetchOrders())
  }

  return (
    <Box>
      <Text size="sm" c="dimmed" mb="sm">
        Toque ou clique uma vez nesta página para ativar o som de novo pedido (exigência do navegador).
      </Text>
      <CustomSimpleGrid cols={5}>
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
    </Box>
  );
}

export default Orders
