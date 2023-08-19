import { Box, Button } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../SummaryCardList"
import OrderItemRow from "../../models/OrderItemRow"
import { FormProvider, OrderFormValues, useForm } from "../../hooks/formContext"
import { SharedContextProvider } from "../contexts/sharedContext"

function OrderForm() {


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
            <SummaryCardList />
            <Button type="submit" size="lg" mt="md" fullWidth>
              Registrar Pedido
            </Button>
          </form>
        </SharedContextProvider>
      </FormProvider>
    </Box >
  )
}

export default OrderForm