import { Box, Button, Flex, Group, NumberInput, Select, Space } from "@mantine/core"
import OrderItemRow from "../../models/OrderItemRow"
import { getCustomerNamesHook, getProductNamesHook } from "../../hooks/useFakeAPI"
import { useState } from "react"
import { useFormContext } from "../../hooks/formContext"

interface OrderItemInputsProps {
  updateProductsTable: any,
  updateTotalAmount: any

}


function OrderItemInputs({ updateProductsTable, updateTotalAmount }: OrderItemInputsProps) {
  const customersResp = getCustomerNamesHook()
  const productsResp = getProductNamesHook()

  const [customerNames, setCustomerNames] = useState(customersResp?.data);
  const [productNames, _setProductNames] = useState(productsResp?.data);

  const [quantity, setQuantity] = useState(1)
  const [productIndex, setProductIndex] = useState("0")
  const form = useFormContext()

  const addProductToTable = (productRow: OrderItemRow): void => {
    updateProductsTable((currentState: OrderItemRow[]) => [...currentState, productRow])
  }

  const sumProductPriceWithTotal = (totalAmount: number, productRow: OrderItemRow): number => {
    return totalAmount + productRow.getTotal()
  }

  const handleOnClick = () => {
    const product = productNames.filter((el: { value: string }) => el.value === productIndex)
    const productRow = new OrderItemRow(productIndex, product[0]["label"], quantity, product[0]["price"])

    addProductToTable(productRow)
    updateTotalAmount((currentState: number) => sumProductPriceWithTotal(currentState, productRow))
    form.insertListItem("products", productRow)
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

      <Group>
        <Flex
          justify="space-between"
          w="100%"
        >

          <Select
            onChange={(value: string) => setProductIndex(value)}
            data={productNames}
            searchable
            label="Selecione o produto"
            placeholder="Digite o nome do produto"
            w="75%"
            size="md"
            required
          />

          <NumberInput
            min={1}
            size="md"
            w="20%"
            label="Quantidade"
            required
            value={1}
            onChange={handleOnChange}
          />
        </Flex>
      </Group>

      <Button size="md" mt="md" fullWidth onClick={handleOnClick} disabled={parseInt(productIndex) == 0}>
        Adicionar produto
      </Button>
    </Box>
  )
}

export default OrderItemInputs