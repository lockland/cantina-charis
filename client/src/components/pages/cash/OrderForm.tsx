import { Box, Button } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../../SummaryCardList"
import OrderItemRow from "../../../models/OrderItemRow"
import { FormProvider, useForm } from "../../../hooks/formContext"
import { SharedContextProvider } from "../../../contexts/sharedContext"
import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"
import { OrderFormValues } from "../../../models/Order"
import { createOrder } from "../../../hooks/useAPI"
import { useCookiesHook } from "../../../hooks/useCookiesHook"

function OrderForm() {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const navigate = useNavigate()
  const { eventId } = useCookiesHook()

  const handleOnSubmit = (values: OrderFormValues, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createOrder(values).then(() => {
      console.info("sent values", values)
      refreshPage()
    })
  }


  const refreshPage = () => {
    navigate(0)
  }

  const form = useForm({
    initialValues: {
      event_id: eventId,
      customer_name: "",
      customer_paid_value: "0",
      order_amount: "0",
      products: []
    },

    validate: {
      customer_name: (value: string) => (value.length > 0) ? null : 'Selecione um cliente por favor!',
      products: (value: OrderItemRow[]) => (value.length > 0) ? null : 'Adicione algum produto para continuar',
    },
  });




  return (
    <Box>
      <FormProvider form={form}>
        <SharedContextProvider>
          <form onSubmit={form.onSubmit(handleOnSubmit)} onReset={form.onReset}>
            <OrderItemInputs />
            <ProductsTable />
            <SummaryCardList setButtonDisabled={setButtonDisabled} />
            <Button type="submit" size="lg" mt="md" fullWidth disabled={buttonDisabled}>
              Registrar Pedido
            </Button>
          </form>
        </SharedContextProvider>
      </FormProvider>
    </Box >
  )
}

export default OrderForm