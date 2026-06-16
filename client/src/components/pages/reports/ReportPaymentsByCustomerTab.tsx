import { Center, Space, Table, Title, useMantineTheme } from "@mantine/core"
import { AppSelect } from "../../../ui"
import CustomerConsumption from "../../../models/CustomerPayment"
import { CustomerNamesOptionType } from "../../../models/Customer"

interface ReportConsumptionByCustomerTabProps {
  customerNames: CustomerNamesOptionType[]
  consumptionByCustomer: CustomerConsumption[]
  onCustomerChange: (customerId: string | null) => void
}

export default function ReportConsumptionByCustomerTab({
  customerNames,
  consumptionByCustomer,
  onCustomerChange,
}: ReportConsumptionByCustomerTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Center>
        <Title>Consumo por cliente</Title>
      </Center>
      <AppSelect
        size="md"
        data={customerNames}
        creatable
        searchable
        label="Selecione o cliente"
        placeholder="Digite o nome do cliente"
        withAsterisk
        onChange={onCustomerChange}
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
            <th>PEDIDO(S)</th>
            <th>CONSUMIDO EM</th>
            <th>PRODUTO</th>
            <th>PREÇO</th>
            <th>QUANTIDADE</th>
            <th>SUBTOTAL</th>
          </tr>
        </thead>
        <tbody>
          {consumptionByCustomer.map((consumption: CustomerConsumption, index: number) => (
            <tr key={index}>
              <td>{consumption.getFormattedOrderDate()}</td>
              <td>{consumption.getFormattedConsumptionDate()}</td>
              <td>{consumption.product_name}</td>
              <td>{consumption.getFormattedPrice()}</td>
              <td>{consumption.product_quantity}</td>
              <td>{consumption.getFormattedSubTotal()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  )
}
