import { Flex, Select, Space, Table, Title } from "@mantine/core"
import DecimalFormatter from "../../../helpers/Decimal"
import { OutgoingRow } from "./outgoingsReport"

interface ReportOutgoingsTabProps {
  eventOptions: { value: string; label: string }[]
  outgoingsRows: OutgoingRow[]
  outgoingsTotal: string
  onEventSelect: (eventId: string | null) => void
}

export default function ReportOutgoingsTab({
  eventOptions,
  outgoingsRows,
  outgoingsTotal,
  onEventSelect,
}: ReportOutgoingsTabProps) {
  return (
    <>
      <Flex direction="column" align="center" mb={10}>
        <Title>Despesas do evento</Title>
        <Title order={2}>Total de despesas: {outgoingsTotal}</Title>
      </Flex>
      <Select
        size="md"
        data={eventOptions}
        searchable
        label="Evento"
        placeholder="Selecione ou digite o nome do evento"
        onChange={onEventSelect}
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
