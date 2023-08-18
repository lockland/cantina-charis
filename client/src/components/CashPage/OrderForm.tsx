import { Box, Button, Space } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../SummaryCardList"
import { useState } from "react"
import OrderItemRow from "../../models/OrderItemRow"
import { FormProvider, OrderFormValues, useForm } from "../../hooks/formContext"

function OrderForm() {
  const [orderItemList, setOrderItemList] = useState<OrderItemRow[]>([])
  const [totalAmount, updateTotalAmount] = useState("0.00")

  const handleOnChange = (event: any) => updateTotalAmount(event.currentTarget.value)
  const handleOnSubmit = (values: OrderFormValues) => {
    console.log(values)
    refreshPage()
  }

  function refreshPage() {
    window.location.reload();
  }

  const form = useForm({
    initialValues: {
      customer_id: "",
      products: [],
      already_paid: false
    },

    validate: {
      customer_id: (value: string) => (parseInt(value) >= 0) ? null : 'Selecione um cliente por favor!',
    },
  });




  return (
    <Box>

      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleOnSubmit)} onReset={form.onReset}>
          <OrderItemInputs updateProductsTable={setOrderItemList} updateTotalAmount={updateTotalAmount} />
          <ProductsTable orderItemList={orderItemList} />
          <SummaryCardList totalAmount={totalAmount} onChange={handleOnChange} />
          <Button type="submit" size="lg" mt="md" fullWidth>
            Registrar Pedido
          </Button>
        </form>
      </FormProvider>
    </Box >
  )
}

export default OrderForm