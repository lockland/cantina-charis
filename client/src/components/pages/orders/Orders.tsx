import { Box, Button, Group, Space, Table, Text } from "@mantine/core";
import { getOrdersHook } from "../../../hooks/useFakeAPI";
import CustomSimpleGrid from "../../CustomSimpleGrid";

function Orders() {
  const { data } = getOrdersHook(30)

  return (
    <CustomSimpleGrid>
      {data.map((order: any, index: number) => {
        return (
          <Box>

            <Box bg="var(--generic-blue)" py="md">
              <Text align="center">{order.customer_name}</Text>
              <Text align="center">R$ {order.order_price}</Text>
            </Box>
            <Box bg="white" p="sm" mih="75%">
              <Group w="100%" position="right" mb="md">
                <Button>Pronto</Button>
              </Group>

              <Table striped withColumnBorders>
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product: any) =>
                    <tr>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
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