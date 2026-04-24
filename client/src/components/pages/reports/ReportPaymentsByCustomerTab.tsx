import { Center, Space, Table, Title, useMantineTheme } from "@mantine/core"
import { AppSelect } from "../../../ui"
import CustomerPayment from "../../../models/CustomerPayment"
import { CustomerNamesOptionType } from "../../../models/Customer"

interface ReportPaymentsByCustomerTabProps {
  customerNames: CustomerNamesOptionType[]
  paymentsByCustomer: CustomerPayment[]
  onCustomerChange: (customerId: string) => void
}

export default function ReportPaymentsByCustomerTab({
  customerNames,
  paymentsByCustomer,
  onCustomerChange,
}: ReportPaymentsByCustomerTabProps) {
  const theme = useMantineTheme()
  return (
    <>
      <Center>
        <Title>Pagamentos por cliente</Title>
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
    </>
  )
}
