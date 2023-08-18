import { Box, Button, Space } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../SummaryCardList"
import { useState } from "react"
import OrderItemRow from "../../models/OrderItem"

function OrderForm() {
  const [orderItemList, setOrderItemList] = useState<OrderItemRow[]>([])
  const [totalAmount, updateTotalAmount] = useState("0.00")

  const handleOnChange = (event: any) => updateTotalAmount(event.currentTarget.value)

  return (
    <Box>

      <form>
        <OrderItemInputs updateProductsTable={setOrderItemList} updateTotalAmount={updateTotalAmount} />
        <Space mt="md" />
        <ProductsTable orderItemList={orderItemList} />
      </form>
      <Space mt="md" />
      <SummaryCardList totalAmount={totalAmount} onChange={handleOnChange} />
      <Space mt="md" />

      <Button type="submit" size="lg" mt="md" fullWidth>
        Registrar Pedido
      </Button>
    </Box>
  )
}

export default OrderForm