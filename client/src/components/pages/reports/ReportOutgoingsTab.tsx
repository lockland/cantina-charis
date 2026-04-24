import { Box, Flex, Space, Table, Title, useMantineTheme } from "@mantine/core"
import { AppDatePickerInput } from "../../../ui"
import DecimalFormatter from "../../../helpers/Decimal"
import { OutgoingRow } from "./outgoingsReport"

interface ReportOutgoingsTabProps {
  dateRange: [Date | null, Date | null]
  onDateRangeChange: (value: [Date | null, Date | null]) => void
  outgoingsRows: OutgoingRow[]
  outgoingsTotal: string
}

export default function ReportOutgoingsTab({
  dateRange,
  onDateRangeChange,
  outgoingsRows,
  outgoingsTotal,
}: ReportOutgoingsTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Flex direction="column" align="center" mb="md">
        <Title>Despesas</Title>
        <Title order={2}>Total no período: {outgoingsTotal}</Title>
      </Flex>
      <Box maw={320} mb="md">
        <AppDatePickerInput
          type="range"
          label="Datas"
          placeholder="Data inicial – Data final"
          value={dateRange}
          onChange={onDateRangeChange}
          valueFormat="DD MMM YYYY"
          labelSeparator=" – "
          size="md"
          clearable
          dropdownType="modal"
          numberOfColumns={2}
          modalProps={{ size: "auto", withCloseButton: false }}
          styles={{
            calendar: {
              "& [data-selected]": {
                backgroundColor: "var(--button-color)",
              },
              "& [data-in-range]": {
                backgroundColor: "var(--secondary-background-color)",
              },
            },
          }}
        />
      </Box>
      <Space mt="xl" />
      <Table
        bg={theme.other?.secondaryBackground as string}
        striped
        withColumnBorders
        withBorder
      >
        <thead>
          <tr>
            <th>Nome do evento</th>
            <th>Data</th>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {outgoingsRows.map((row: OutgoingRow, index: number) => (
            <tr key={index}>
              <td>{row.event_name}</td>
              <td>{row.created_at ? new Date(row.created_at).toLocaleString("pt-BR") : ""}</td>
              <td>{row.description}</td>
              <td>{DecimalFormatter.format(row.amount)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
