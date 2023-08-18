import { Box, Flex, Title } from "@mantine/core"
import OrdersCardList from "../../OrdersCardList"
import OrderForm from "../../CashPage/OrderForm";

function CashPage() {
  return (
    <Flex
      justify="space-between"
    >
      <Box w="49%" mah={700} style={{ overflow: "auto" }} >
        <Title align="center" order={2} >Pedidos</Title>
        <OrdersCardList />
      </Box>

      <Box w="49%" mah={700} >
        <Title align="center" order={2}>Caixa</Title>
        <OrderForm />
      </Box>
    </Flex >
  )
}

export default CashPage