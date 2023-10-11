import { Box, Center, Flex, Select, Space, Table, Title } from "@mantine/core";
import { getBalance, getCustomerNames, getCustomerPayments, getEventsSummary } from "../../../hooks/useAPI";
import ReportEntry from "../../../models/ReportEntry";
import { useEffect, useState } from "react";
import ReportEntries from "../../../models/ReportsEntries";
import { Tabs } from '@mantine/core';
import DailyBalanceEntry from "../../../models/DailyBalance";
import { CustomerNamesOptionType, CustomerType } from "../../../models/Customer";
import { buildReportCustomerNamesList } from "../../../helpers/SelectLists";
import CustomerPayment from "../../../models/CustomerPayment";

function Reports() {

  const [summaryRows, setSummaryRows] = useState(new ReportEntries)
  const [balance, setBalance] = useState<DailyBalanceEntry[]>([])
  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([]);
  const [paymentsByCustomer, setPaymentsByCustomer] = useState<CustomerPayment[]>([])

  useEffect(() => {
    getEventsSummary().then((response: ReportEntries) => {
      const list = new ReportEntries
      response.map((entryData) => {
        return list.push(ReportEntry.buildFromData(entryData))
      })
      setSummaryRows(list)
    })

    getBalance(7).then((response: DailyBalanceEntry[]) => {
      const list: DailyBalanceEntry[] = []
      response.map((entryData: DailyBalanceEntry) => {
        return list.push(DailyBalanceEntry.buildFromData(entryData))
      })
      setBalance(list)
    })

    getCustomerNames().then((response: CustomerType[]) => {
      const list = buildReportCustomerNamesList(response)
      setCustomerNames(list)
    })

  }, [])

  const handleOnChange = (customerId: string) => {
    getCustomerPayments(customerId)
      .then((response: CustomerPayment[]) => {
        const list: CustomerPayment[] = []
        response.map((entryData: CustomerPayment) => {
          return list.push(CustomerPayment.buildFromData(entryData))
        })
        setPaymentsByCustomer(list)
      })
  }

  return (
    <Box p={7}>
      <Tabs defaultValue="first" variant="pills">
        <Tabs.List>
          <Tabs.Tab value="first">Sumário de eventos</Tabs.Tab>
          <Tabs.Tab value="second">Balanço últimos 7 dias</Tabs.Tab>
          <Tabs.Tab value="third">Pedidos pagos por cliente</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first">
          <Flex
            direction="column"
            align="center"
            mb={10}
          >
            <Title>Sumário dos eventos cadastrados</Title>
            <Title order={2}>
              Valor apurado até o momento: {summaryRows.getFormattedLiquidFounds()}
            </Title>
          </Flex>
          <Table
            bg="var(--secondary-background-color)"
            striped
            withColumnBorders
            withBorder
          >
            <thead>
              <tr>
                <th>EVENTO</th>
                <th>ABERTURA DO CAIXA</th>
                <th>DATA DO EVENTO</th>
                <th>ENTRADAS</th>
                <th>DESPESAS</th>
                <th>EM ABERTO</th>
                <th>TOTAL BRUTO</th>
                <th>TOTAL LÍQUIDO</th>
              </tr>
            </thead>
            <tbody>
              {summaryRows.map((event: ReportEntry) => (
                <tr key={event.event_id}>
                  <td>{event.event_name}</td>
                  <td>{event.getFormattedOpenAmount()}</td>
                  <td>{event.getFormattedCreatedAt()}</td>
                  <td>{event.getFormattedIncoming()}</td>
                  <td>{event.getFormattedOutgoing()}</td>
                  <td>{event.getFormattedDebits()}</td>
                  <td>{event.getFormattedBalance()}</td>
                  <td>{event.getFormattedLiquidFunds()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="second">

          <Center>
            <Title>Balanço dos últimos 7 dias</Title>
          </Center>
          <Table
            bg="var(--secondary-background-color)"
            striped
            withColumnBorders
            withBorder
          >
            <thead>
              <tr>
                <th>DATA</th>
                <th>ENTRADAS</th>
                <th>DESPESAS</th>
              </tr>
            </thead>
            <tbody>
              {balance.map((event: DailyBalanceEntry, index: number) => (
                <tr key={index}>
                  <td>{event.getFormattedDate()}</td>
                  <td>{event.getFormattedIncoming()}</td>
                  <td>{event.getFormattedOutgoing()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tabs.Panel>
        <Tabs.Panel value="third">
          <Center>
            <Title>Pagamentos por cliente</Title>
          </Center>
          <Select
            size="md"
            data={customerNames}
            creatable
            searchable
            label="Selecione o cliente"
            placeholder="Digite o nome do cliente"
            withAsterisk
            onChange={handleOnChange}
          />
          <Space mt="xl" />
          <Table
            bg="var(--secondary-background-color)"
            striped
            withColumnBorders
            withBorder
          >
            <thead>
              <tr>
                <th>PEDIDO(S)</th>
                <th>PAGO EM</th>
                <th>PRODUTO</th>
                <th>PREÇO</th>
                <th>QUANTIDADE</th>
                <th>SUBTOTAL</th>
              </tr>
            </thead>
            <tbody>
              {paymentsByCustomer.map((payment: CustomerPayment, index: number) => (
                <tr key={index}>
                  <td>{payment.getFormattedOrderDate()}</td>
                  <td>{payment.getFormattedPaymentDate()}</td>
                  <td>{payment.product_name}</td>
                  <td>{payment.getFormattedPrice()}</td>
                  <td>{payment.product_quantity}</td>
                  <td>{payment.getFormattedSubTotal()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tabs.Panel>
      </Tabs>
    </Box>
  );
}

export default Reports