import { Box, Center, Flex, Table, Title } from "@mantine/core";
import { getBalance, getEventsSummary } from "../../../hooks/useAPI";
import ReportEntry from "../../../models/ReportEntry";
import { useEffect, useState } from "react";
import ReportEntries from "../../../models/ReportsEntries";
import { Tabs } from '@mantine/core';
import DailyBalanceEntry from "../../../models/DailyBalance";

function Reports() {

  const [summaryRows, setSummaryRows] = useState(new ReportEntries)
  const [balance, setBalance] = useState<DailyBalanceEntry[]>([])

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
  }, [])

  return (
    <Box p={7}>
      <Tabs defaultValue="first" variant="pills">
        <Tabs.List>
          <Tabs.Tab value="first">Sumário de eventos</Tabs.Tab>
          <Tabs.Tab value="second">Balanço últimos 7 dias</Tabs.Tab>
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
      </Tabs>


    </Box>
  );
}

export default Reports