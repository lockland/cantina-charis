import { Box, Text } from "@mantine/core"

interface OrdersCardProps {
  cname: string
  price: string
}

function OrdersCard({ cname, price }: OrdersCardProps) {

  return (
    <Box w="100%" bg="var(--orders-card-background-color)" py={15}>
      <Text align="center">{cname}</Text>
      <Text align="center">R$ {price}</Text>
    </Box>
  )
}

export default OrdersCard