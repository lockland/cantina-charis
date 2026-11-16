import { Box, Button, Group, Modal } from "@mantine/core"
import OrderItemInputs from "./OrderItemInputs"
import ProductsTable from "./ProductsTable"
import SummaryCardList from "../../SummaryCardList"
import OrderItemRow from "../../../models/OrderItemRow"
import { FormProvider, useForm } from "../../../hooks/formContext"
import { type FormEvent, useEffect, useState } from "react"
import { OrderFormValues } from "../../../models/Order"
import { createOrder } from "../../../hooks/useAPI"
import { useSharedContext } from "../../../hooks/useSharedContext"
import { AppTextarea, showNotification, useMediaQuery } from "../../../ui"

function OrderForm() {

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [cashSessionVersion, setCashSessionVersion] = useState(0)
  const [pendingOrder, setPendingOrder] = useState<OrderFormValues | null>(null)
  const [observation, setObservation] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const isMobile = useMediaQuery("(max-width: 787px)")
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

  const handleOnSubmit = (values: OrderFormValues) => {
    setObservation("")
    setPendingOrder({ ...values, products: [...values.products] })
  }

  const handleCancelObservation = () => {
    if (submitting) return
    setPendingOrder(null)
    setObservation("")
  }

  const handleConfirmOrder = async () => {
    if (!pendingOrder || submitting) return

    setSubmitting(true)
    try {
      await createOrder({ ...pendingOrder, observation })
      setOrderAmount(0)
      setOrderItemList([])
      form.setValues({
        event_id: pendingOrder.event_id,
        customer_name: "",
        observation: "",
        customer_paid_value: "0",
        order_amount: "0",
        products: [],
      })
      form.clearErrors()
      setButtonDisabled(true)
      setCashSessionVersion((v) => v + 1)
      setPendingOrder(null)
      setObservation("")
    } catch (error) {
      showNotification({
        title: "Falha ao registrar pedido",
        message: error instanceof Error ? error.message : "Não foi possível registrar o pedido",
        color: "red",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleObservationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void handleConfirmOrder()
  }

  return (
    <Box>
      <Modal
        opened={pendingOrder !== null}
        onClose={handleCancelObservation}
        title="Observação do pedido"
        fullScreen={isMobile}
        transitionProps={{ transition: "fade", duration: 200 }}
        closeOnClickOutside={!submitting}
        closeOnEscape={!submitting}
        withCloseButton={!submitting}
      >
        <form onSubmit={handleObservationSubmit}>
          <AppTextarea
            size="md"
            label="Observação"
            placeholder="Digite uma observação (opcional)"
            value={observation}
            onChange={(event) => setObservation(event.currentTarget.value)}
            minRows={3}
            autosize
            disabled={submitting}
          />
          <Group position="right" mt="md">
            <Button type="button" variant="default" onClick={handleCancelObservation} disabled={submitting}>
              Cancelar
            </Button>
            <Button type="submit" data-autofocus loading={submitting}>
              Registrar pedido
            </Button>
          </Group>
        </form>
      </Modal>
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
