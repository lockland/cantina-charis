import { Flex, Table, Title, useMantineTheme } from "@mantine/core"
import ReportEntry from "../../../models/ReportEntry"
import ReportEntries from "../../../models/ReportsEntries"

interface ReportSummariesTabProps {
  summaryRows: ReportEntries
}

export default function ReportSummariesTab({ summaryRows }: ReportSummariesTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Flex direction="column" align="center" mb="md">
        <Title>Sumário dos eventos cadastrados</Title>
        <Title order={2}>Valor apurado até o momento: {summaryRows.getFormattedLiquidFounds()}</Title>
      </Flex>
      <Table
        bg={theme.other?.secondaryBackground as string}
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
    </>
  )
}
