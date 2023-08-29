import { Box, Button, Grid, NumberInput, Select, Space } from "@mantine/core"
import OrderItemRow from "../../../models/OrderItemRow"
import { useEffect, useState } from "react"
import { useFormContext } from "../../../hooks/formContext"
import { useSharedContext } from "../../../hooks/useSharedContext"
import { buildCustomerNamesList, buildProductsList } from "../../../helpers/SelectLists"
import { getCustomerNames, getEnabledProducts } from "../../../hooks/useAPI"
import { CustomerType, CustomerNamesOptionType } from "../../../models/Customer"
import { ProductOptionType, ProductType } from "../../../models/Product"

function OrderItemInputs() {

  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([]);
  const [products, setProducts] = useState<ProductOptionType[]>([]);

  useEffect(() => {
    getCustomerNames().then((response: CustomerType[]) => {
      const list = buildCustomerNamesList(response)
      setCustomerNames(list)
    })

    getEnabledProducts().then((response: ProductType[]) => {
      const list = buildProductsList(response)
      setProducts(list)
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
    const product: ProductOptionType[] = products.filter((el: { value: string }) => el.value === productIndex)
    const productRow = new OrderItemRow(
      productIndex,
      product[0]["product_name"],
      quantity,
      product[0]["product_price"]
    )

    const amount = orderAmount + productRow.getTotal()

    addProductToTable(productRow)
    setOrderAmount(amount)
    form.setFieldValue("order_amount", amount)
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
          const item: CustomerNamesOptionType = { value: query, label: query };
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
        {...form.getInputProps("customer_name")}
      />
      <Space mt="md" />


      <Grid>
        <Grid.Col md={6} lg={9}>
          <Select
            onChange={(value: string) => setProductIndex(value)}
            data={products}
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