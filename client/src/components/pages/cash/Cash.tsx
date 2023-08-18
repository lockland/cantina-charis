import { Box, Button, Flex, Group, NumberInput, Select, SimpleGrid, Space, Table, Title } from "@mantine/core"
import OrdersCardList from "../../OrdersCardList"
import { useState } from "react";
import OrderItemRow from "../../../models/OrderItem";
import { getCustomerNamesHook, getProductNamesHook } from "../../../hooks/useFakeAPI";
import SummaryCardList from "../../SummaryCardList";

function CashPage() {

  const customersResp = getCustomerNamesHook()
  const [customerNames, setCustomerNames] = useState(customersResp?.data);
  const [qtd, setQtd] = useState(1)
  const [productIndex, setProductIndex] = useState("0")
  const [totalAmount, updateTotalAmount] = useState("1000")


  const productsResp = getProductNamesHook()
  const [productNames, setProductNames] = useState(productsResp?.data);

  const addProductToTable = (): void => {
    const product = productNames.filter((el: { value: string }) => el.value === productIndex)
    const productRow = new OrderItemRow(product[0]["label"], qtd, product[0]["price"])

    updateTotalAmount((currentState) => {
      const newAmount = parseFloat(currentState) + parseFloat(product[0]["price"])
      return newAmount.toFixed(2)
    })

    setElements((currentState) => [...currentState, productRow])

  }


  const [elements, setElements] = useState<OrderItemRow[]>([])

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.qtd}</td>
      <td>{`R$ ${element.getPrice()}`}</td>
      <td>{`R$ ${element.getTotal()}`}</td>
    </tr>
  ));

  const boxSize = "49%"

  const overflow = { overflow: "auto" }
  return (
    <Flex
      justify="space-between"
    >
      <Box
        w={boxSize}
        mah={700}
        style={overflow}
      >
        <Title align="center" order={2} >Pedidos</Title>
        <OrdersCardList />
      </Box>

      <Box w={boxSize} mah={700}
      >
        <Title align="center" order={2}>Caixa</Title>
        <form>

          <Select
            size="md"
            onChange={console.log}
            onCreate={(query) => {
              debugger
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
            required
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

              <NumberInput size="md" w="20%" label="Quantidade" required value={1} onChange={(value: number) => { setQtd(value) }} />
            </Flex>
          </Group>

          <Button size="md" mt="md" fullWidth onClick={addProductToTable} >
            Adicionar produto
          </Button>
          <Space mt="md" />
          <Box bg="var(--secondary-background-color)" mih={250} mah={280} style={overflow}>
            <Table striped >
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Valor unitário</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>{rows}</tbody>
            </Table>
          </Box>
        </form>
        <Space mt="md" />
        <SummaryCardList totalAmount={totalAmount} onChange={(event: any) => updateTotalAmount(event.currentTarget.value)} />
        <Space mt="md" />

        <Button type="submit" size="lg" mt="md" fullWidth>
          Registrar Pedido
        </Button>
      </Box>
    </Flex >
  )
}

export default CashPage