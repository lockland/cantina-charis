import { Flex, Space, Table, Title, useMantineTheme } from "@mantine/core"
import { AppSelect } from "../../../ui"
import DecimalFormatter from "../../../helpers/Decimal"
import { SoldProductRow } from "./soldProductsReport"

interface ReportSoldProductsTabProps {
  eventOptions: { value: string; label: string }[]
  soldProductsRows: SoldProductRow[]
  soldProductsTotal: string
  onEventSelect: (eventId: string | null) => void
}

export default function ReportSoldProductsTab({
  eventOptions,
  soldProductsRows,
  soldProductsTotal,
  onEventSelect,
}: ReportSoldProductsTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Flex direction="column" align="center" mb="md">
        <Title>Produtos vendidos</Title>
        <Title order={2}>Valor arrecadado no evento: {soldProductsTotal}</Title>
      </Flex>
      <AppSelect
        size="md"
        data={eventOptions}
        searchable
        label="Evento"
        placeholder="Selecione ou digite o nome do evento e pressione Enter"
        onChange={onEventSelect}
      />
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
            <th>Cliente</th>
            <th>Produto</th>
            <th>Preço unitário</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {soldProductsRows.map((row: SoldProductRow, index: number) => (
            <tr key={index}>
              <td>{row.event_name}</td>
              <td>{row.order_created_at ? new Date(row.order_created_at).toLocaleString("pt-BR") : ""}</td>
              <td>{row.customer_name}</td>
              <td>{row.product_name}</td>
              <td>{DecimalFormatter.format(row.price)}</td>
              <td>{row.quantity}</td>
              <td>{DecimalFormatter.format(row.subtotal)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
