import { Box, Button, Grid, NumberInput, Select, Space } from "@mantine/core"
import OrderItemRow from "../../../models/OrderItemRow"
import { getProductNames } from "../../../hooks/useFakeAPI"
import { useEffect, useState } from "react"
import { useFormContext } from "../../../hooks/formContext"
import { useSharedContext } from "../../../hooks/useSharedContext"
import { buildCustomerNamesList } from "../../../helpers/SelectLists"
import { getCustomerNames } from "../../../hooks/useAPI"
import { customerType, CustomerNamesOptionType } from "../../../models/Customer"

function OrderItemInputs() {
  const productsResp = getProductNames()

  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([]);
  const [productNames, _setProductNames] = useState(productsResp?.data);

  useEffect(() => {
    getCustomerNames().then((response: customerType[]) => {
      const list = buildCustomerNamesList(response)
      setCustomerNames(list)
    })
  }, [])

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
          const item: CustomerNamesOptionType = { value: "0", label: query };
          setCustomerNames((current: CustomerNamesOptionType[]) => [...current, item]);
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