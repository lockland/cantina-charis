import { Box, Flex, Title } from "@mantine/core"
import { inherits } from "util"

function CashPage() {
  return (
    <Flex
      justify="space-between"
      maw="inherit"
    >

      <Box
        style={{
          backgroundColor: "green"
        }}

        w="50%"
      >
        <Title align="center">Pedidos</Title>
      </Box>
      <Box w="50%"><Title align="center">Caixa</Title></Box>
    </Flex>
  )
}

export default CashPage