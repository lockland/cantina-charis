import { Box, Button } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../../SummaryCardList"
import OrderItemRow from "../../../models/OrderItemRow"
import { FormProvider, useForm } from "../../../hooks/formContext"
import { FormEvent, useEffect, useState } from "react"
import { OrderFormValues } from "../../../models/Order"
import { createOrder } from "../../../hooks/useAPI"
import { useSharedContext } from "../../../hooks/useSharedContext"

function OrderForm() {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [cashSessionVersion, setCashSessionVersion] = useState(0)
  const { openEvent, openEventHydrated, setOrderAmount, setOrderItemList } = useSharedContext()

  const form = useForm({
    initialValues: {
      event_id: openEvent.event_id,
      customer_name: "",
      observation: "",
      customer_paid_value: "0",
      order_amount: "0",
      products: []
    },

    validate: {
      customer_name: (value: string) => (value.length > 0) ? null : 'Selecione um cliente por favor!',
      products: (value: OrderItemRow[]) => (value.length > 0) ? null : 'Adicione algum produto para continuar',
    },
  });

  useEffect(() => {
    if (openEventHydrated && openEvent.event_id > 0) {
      form.setFieldValue("event_id", openEvent.event_id)
    }
  }, [openEventHydrated, openEvent.event_id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleOnSubmit = (values: OrderFormValues, event: FormEvent<HTMLFormElement>) => {
    const resp = prompt("Alguma observação para o pedido?")
    if (null === resp) return

    values.observation = resp
    event.preventDefault();
    createOrder(values).then(() => {
      console.info("sent values", values)
      setOrderAmount(0)
      setOrderItemList([])
      form.setValues({
        event_id: values.event_id,
        customer_name: "",
        observation: "",
        customer_paid_value: "0",
        order_amount: "0",
        products: [],
      })
      form.clearErrors()
      setButtonDisabled(true)
      setCashSessionVersion((v) => v + 1)
    })
  }

  return (
    <Box>
      <FormProvider form={form}>
        <form onSubmit={form.onSubmit(handleOnSubmit)} onReset={form.onReset}>
          <OrderItemInputs cashSessionVersion={cashSessionVersion} />
          <ProductsTable />
          <SummaryCardList key={cashSessionVersion} setButtonDisabled={setButtonDisabled} />
          <Button type="submit" size="lg" mt="md" fullWidth disabled={buttonDisabled}>
            Registrar Pedido
          </Button>
        </form>
      </FormProvider>
    </Box >
  )
}

export default OrderForm
