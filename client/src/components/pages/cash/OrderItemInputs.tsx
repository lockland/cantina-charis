import { Box, Button, Grid, NumberInput, Select, Space } from "@mantine/core"
import OrderItemRow from "../../../models/OrderItemRow"
import { getCustomerNamesHook, getProductNamesHook } from "../../../hooks/useFakeAPI"
import { useState } from "react"
import { useFormContext } from "../../../hooks/formContext"
import { useSharedContext } from "../../../hooks/useSharedContext"

function OrderItemInputs() {
  const customersResp = getCustomerNamesHook()
  const productsResp = getProductNamesHook()

  const [customerNames, setCustomerNames] = useState(customersResp?.data);
  const [productNames, _setProductNames] = useState(productsResp?.data);

  const [quantity, setQuantity] = useState(1)
  const [productIndex, setProductIndex] = useState("0")

  const form = useFormContext()
  const { orderAmount, setOrderAmount, setOrderItemList } = useSharedContext()

  const addProductToTable = (productRow: OrderItemRow): void => {
    setOrderItemList((currentState: OrderItemRow[]) => [...currentState, productRow])
  }

  const handleOnClick = () => {
    const product = productNames.filter((el: { value: string }) => el.value === productIndex)
    const productRow = new OrderItemRow(productIndex, product[0]["name"], quantity, product[0]["price"])

    addProductToTable(productRow)
    setOrderAmount((orderAmount + productRow.getTotal()))
    form.insertListItem("products", productRow)
    form.clearFieldError("products")
    setQuantity(1)
  }

  const handleOnChange = (value: number) => setQuantity(value)

  return (
    <Box>

      <Select
        size="md"
        onCreate={(query) => {
          const item = { value: "0", label: query };
          setCustomerNames((current: any) => [...current, item]);
          return item;
        }}

        getCreateLabel={(query) => `+ Adicionar ${query}`}

        data={customerNames}
        creatable
        searchable
        label="Selecione o cliente"
        placeholder="Digite o nome do cliente"
        withAsterisk
        {...form.getInputProps("customer_id")}
      />
      <Space mt="md" />


      <Grid>
        <Grid.Col md={6} lg={9}>
          <Select
            onChange={(value: string) => setProductIndex(value)}
            data={productNames}
            searchable
            label="Selecione o produto"
            placeholder="Digite o nome do produto"
            size="md"
            required
          />
        </Grid.Col>
        <Grid.Col md={6} lg={3}>
          <NumberInput
            min={1}
            size="md"
            label="Quantidade"
            required
            value={1}
            onChange={handleOnChange}
          />
        </Grid.Col>
      </Grid>

      <Button size="md" mt="md" fullWidth onClick={handleOnClick} disabled={parseInt(productIndex) == 0}>
        Adicionar produto
      </Button>
    </Box>
  )
}

export default OrderItemInputs