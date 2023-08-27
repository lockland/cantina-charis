import { Box, Button, Group, Space, Table, Text, Title } from "@mantine/core";
import { getOrders } from "../../../hooks/useFakeAPI";
import CustomSimpleGrid from "../../CustomSimpleGrid";
import DecimalFormatter from "../../../helpers/Decimal";

function Orders() {
  const { data } = getOrders(30)

  const handleOnClick = (id: string) => {
    console.log(id)
  }

  return (
    <CustomSimpleGrid cols={4}>
      {data.map((order: any, index: number) => {
        return (
          <Box key={index}>
            <Box bg="var(--generic-blue)" py="sm">
              <Title order={2} align="center">{order.customer_name}</Title>
              <Text align="center">{DecimalFormatter.format(order.order_amount)}</Text>
            </Box>
            <Box bg="var(--generic-blue)" p="sm">
              <Group w="100%" position="right" mb="md">
                <Button onClick={() => handleOnClick(order.id)} fullWidth>Pronto</Button>
              </Group>

              <Table striped withColumnBorders bg="var(--secondary-background-color)">
                <thead>
                  <tr>
                    <th>Produto</th>
                    <th>Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product: any, index: number) =>
                    <tr key={index}>
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