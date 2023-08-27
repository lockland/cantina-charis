import { Box, Text } from "@mantine/core"
import DecimalFormatter from "../helpers/Decimal"

interface OrdersCardProps {
  cname: string
  price: string
}

function OrdersCard({ cname, price }: OrdersCardProps) {

  return (
    <Box w="100%" bg="var(--orders-card-background-color)" py={15}>
      <Text align="center">{cname}</Text>
      <Text align="center">{DecimalFormatter.format(price)}</Text>
    </Box>
  )
}

export default OrdersCard