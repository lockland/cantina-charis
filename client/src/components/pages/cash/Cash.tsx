import { Box, Button, Center, Checkbox, Flex, Group, NumberInput, Select, SimpleGrid, Space, Table, Title } from "@mantine/core"
import OrdersCardList from "../../OrdersCardList"
import { useState } from "react";
import SummaryCard from "../../SummaryCard";

function CashPage() {
  const [data, setData] = useState([
    { value: 'react', label: 'React' },
    { value: 'ng', label: 'Angular' },
  ]);

  const elements = [
    { mass: 12.011, symbol: 'C', name: 'Carbon' },
    { mass: 14.007, symbol: 'N', name: 'Nitrogen' },
    { mass: 88.906, symbol: 'Y', name: 'Yttrium' },
    { mass: 137.33, symbol: 'Ba', name: 'Barium' },
    { mass: 140.12, symbol: 'Ce', name: 'Cerium' },
  ];

  const rows = elements.map((element) => (
    <tr key={element.name}>
      <td>{element.name}</td>
      <td>{element.symbol}</td>
      <td>{element.mass}</td>
    </tr>
  ));

  const boxSize = "49%"
  return (
    <Flex
      justify="space-between"
    >
      <Box
        w={boxSize}
        mah={800}
      >
        <Title align="center" order={2} >Pedidos</Title>
        <OrdersCardList />
      </Box>

      <Box w={boxSize}>
        <Title align="center" order={2}>Caixa</Title>
        <form>

          <Select
            size="md"
            onChange={console.log}
            onCreate={(query) => {
              const item = { value: query, label: query };
              setData((current) => [...current, item]);
              return item;
            }}
            getCreateLabel={(query) => `+ Adicionar ${query}`}

            data={data}
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
                onChange={console.log}
                data={data}
                searchable
                label="Selecione o produto"
                placeholder="Digite o nome do produto"
                w="75%"
                size="md"
                required
              />

              <NumberInput size="md" w="20%" label="Quantidade" required value={0} />
            </Flex>
          </Group>

          <Button size="md" mt="md" fullWidth>
            Adicionar produto
          </Button>
          <Space mt="md" />
          <Table bg="var(--secondary-background-color)">
            <thead>
              <tr>
                <th>Element name</th>
                <th>Symbol</th>
                <th>Atomic mass</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        </form>
        <Space mt="md" />
        <SimpleGrid cols={3}>
          <SummaryCard title="Total" price="1000,00" />
          <SummaryCard title="Valor pago" price="0" />
          <SummaryCard title="Troco" price="1000,00" />
        </SimpleGrid>
        <Space mt="md" />

        <Button type="submit" size="lg" mt="md" fullWidth>
          Registrar Pedido
        </Button>
      </Box>
    </Flex >
  )
}

export default CashPage