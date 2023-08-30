import { Box, Flex, Table, Title } from "@mantine/core";
import { getEventsSummary } from "../../../hooks/useAPI";
import ReportEntry from "../../../models/ReportEntry";
import { useEffect, useState } from "react";
import ReportEntries from "../../../models/ReportsEntries";

function Reports() {

  const [rows, setRows] = useState(new ReportEntries)

  useEffect(() => {
    getEventsSummary().then((response: ReportEntries) => {
      const list = new ReportEntries
      response.map((entryData) => {
        return list.push(ReportEntry.buildFromData(entryData))
      })
      setRows(list)
    })
  }, [])

  return (
    <Box p={7}>
      <Flex
        direction="column"
        align="center"
        mb={10}
      >
        <Title>Sumário dos eventos cadastrados</Title>
        <Title order={2}>
          Valor apurado até o momento: {rows.getFormattedLiquidFounds()}
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
            <th>NOME DO EVENTO</th>
            <th>ABERTURA DO CAIXA</th>
            <th>DATA DO EVENTO</th>
            <th>TOTAL DE ENTRADAS</th>
            <th>TOTAL DE DESPESAS</th>
            <th>TOTAL BRUTO</th>
            <th>TOTAL LÍQUIDO</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((event: ReportEntry) => (
            <tr key={event.event_id}>
              <td>{event.event_name}</td>
              <td>{event.getFormattedOpenAmount()}</td>
              <td>{event.getFormattedCreatedAt()}</td>
              <td>{event.getFormattedIncoming()}</td>
              <td>{event.getFormattedOutgoing()}</td>
              <td>{event.getFormattedBalance()}</td>
              <td>{event.getFormattedLiquidFunds()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Box>
  );
}

export default Reports