import { Box, Flex, Title } from "@mantine/core"
import OrdersCardList from "../../OrdersCardList"

function CashPage() {
  const boxSize = "49%"
  return (
    <Flex
      justify="space-between"
    >
      <Box
        w={boxSize}
        mah={800}
      >
        <Title align="center" order={2} >Pedidos</Title>
        <OrdersCardList />
      </Box>

      <Box w={boxSize}>
        <Title align="center" order={2}>Caixa</Title>
      </Box>
    </Flex>
  )
}

export default CashPage