import { Accordion, Box, Button, Divider, Flex, Group, Text } from "@mantine/core";
import { getDebits, payDebits } from "../../../hooks/useAPI";
import { useEffect, useState } from "react";
import Debit, { DebitType } from "../../../models/Debit";
import { DebitOrderType } from "../../../models/DebitOrder";

function Debits() {
  const [debits, setDebits] = useState<Debit[]>([])

  useEffect(() => {
    getDebits().then((response: DebitType[]) => {
      setDebits(response.map((debitData: DebitType) => {
        return Debit.buildFromData(debitData)
      }))
    })
  }, [])

  const handleOnClick = async (id: number) => {
    const resp = prompt("💰 Digite o valor que será abatido do débito 💵")
    const paidValue = parseFloat(resp || "0")
    const customerDebit = debits.filter((debit) => debit.customer.id == id)

    if (!resp) return

    const debitData: DebitType = await payDebits(id, paidValue)
    if (paidValue < customerDebit[0].total) {
      setDebits(debits.map(debit => (debit.customer.id != id) ? debit : Debit.buildFromData(debitData)))
    } else {
      setDebits(debits.filter((debit) => debit.customer.id != id))
    }

    console.log(`paid value ${paidValue} in debits for customer_id: ${id}`)
  }

  const items = debits.map((debit: Debit, index: number) => {
    return (
      <Accordion.Item key={index} value={debit.customer.id.toString()}>
        <Accordion.Control>
          <Flex
            justify="space-between"
            align="center"
          >

            <Text>
              {debit.customer.name}
            </Text>
            <Text><b>TOTAL: </b>{debit.getFormattedTotal()}</Text>
          </Flex>
        </Accordion.Control>
        <Accordion.Panel>
          <Group position="right">
            <Button onClick={() => handleOnClick(debit.customer.id)}>Quitar débito</Button>
          </Group>
          {debit.orders.map((order: DebitOrderType, index: number) => {
            return (
              <Box key={index}>
                <Divider mb={20} mt={20} />
                <Text><b>Evento: </b>{order.event_name}</Text>
                <Text><b>Data: </b>{order.getFormattedCreatedAt()}</Text>
                <Text><b>Total: </b>{order.getFormattedOrderAmount()}</Text>
                <Text><b>Valor pago: </b>{order.getFormattedPaidValue()}</Text>
                <Text><b>Valor remanescente: </b>{order.getFormattedDebitValue()}</Text>
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