import { Accordion, Box, Button, Divider, Flex, Group, Text, Title } from "@mantine/core";
import { getDebits } from "../../../hooks/useFakeAPI";

function Debits() {

  const { data } = getDebits(10)

  const handleOnClick = (id: any) => {
    const resp = confirm("Deseja mesmo definir esse debito como pago?")

    if (resp) {
      console.log(id)
    }
  }

  const items = data.map((debit: any, index: number) => {
    return (
      <Accordion.Item key={index} value={debit.customer.id}>
        <Accordion.Control>
          <Flex
            justify="space-between"
            align="center"
          >

            <Text>
              {debit.customer.name}
            </Text>
            <Text><b>TOTAL: </b>R$ {debit.total}</Text>
          </Flex>
        </Accordion.Control>
        <Accordion.Panel>
          <Group position="right">
            <Button onClick={() => handleOnClick(debit.customer.id)}>Quitar débito</Button>
          </Group>
          {debit.orders.map((order: any, index: number) => {
            return (
              <Box key={index}>
                <Divider mb={20} mt={20} />
                <Text><b>Evento: </b>{order.event_name}</Text>
                <Text><b>Data: </b>{order.date}</Text>
                <Text><b>Total: </b>R$ {order.total}</Text>
                <Text><b>Valor pago: </b>R$ {order.paid_value}</Text>
                <Text><b>Valor remanescente: </b>R$ {(parseFloat(order.total) - parseFloat(order.paid_value)).toFixed(2)}</Text>
              </Box>
            )
          })}
        </Accordion.Panel>
      </Accordion.Item>
    )
  })

  return (
    <Accordion variant="separated">
      {items}
    </Accordion>
  );
}

export default Debits