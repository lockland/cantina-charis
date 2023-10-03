import { Box, Divider, Text } from "@mantine/core"
import DecimalFormatter from "../helpers/Decimal"

interface OrdersCardProps {
  customer_name: string
  order_amount: string
  paid_value: string
}

function OrdersCard({ customer_name, order_amount, paid_value }: OrdersCardProps) {

  const status = parseFloat(paid_value) < parseFloat(order_amount) ? "Em aberto" : "Paga"

  return (
    <Box w="100%" bg="var(--orders-card-background-color)" py={15}>
      <Text align="center">{customer_name}</Text>
      <Text align="center">{DecimalFormatter.format(order_amount)}</Text>
      <Divider my={10} />
      <Text align="center">{status}</Text>
    </Box>
  )
}

export default OrdersCard