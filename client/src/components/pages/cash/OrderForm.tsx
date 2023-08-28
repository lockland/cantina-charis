import { Box, Button } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../../SummaryCardList"
import OrderItemRow from "../../../models/OrderItemRow"
import { FormProvider, OrderFormValues, useForm } from "../../../hooks/formContext"
import { SharedContextProvider } from "../../../contexts/sharedContext"
import { FormEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

function OrderForm() {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    console.log("Rendered")
  })

  const handleOnSubmit = (values: OrderFormValues, event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(values, event)
    //refreshPage()
  }


  const refreshPage = () => {
    navigate(0)
  }

  const form = useForm({
    initialValues: {
      customer_name: "",
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