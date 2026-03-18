import { Center, Table, Title, useMantineTheme } from "@mantine/core"
import DailyBalanceEntry from "../../../models/DailyBalance"

interface ReportBalanceTabProps {
  balance: DailyBalanceEntry[]
}

export default function ReportBalanceTab({ balance }: ReportBalanceTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Center>
        <Title>Balanço dos últimos 7 dias</Title>
      </Center>
      <Table
        bg={theme.other?.secondaryBackground as string}
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
    </>
  )
}
