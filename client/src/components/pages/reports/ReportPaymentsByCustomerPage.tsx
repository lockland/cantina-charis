import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getCustomerNames, getCustomerPayments } from "../../../hooks/useAPI"
import { CustomerNamesOptionType, CustomerType } from "../../../models/Customer"
import { buildReportCustomerNamesList } from "../../../helpers/SelectLists"
import CustomerPayment from "../../../models/CustomerPayment"
import ReportPaymentsByCustomerTab from "./ReportPaymentsByCustomerTab"

export default function ReportPaymentsByCustomerPage() {
  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([])
  const [paymentsByCustomer, setPaymentsByCustomer] = useState<CustomerPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getCustomerNames()
      .then((response: CustomerType[]) => {
        setCustomerNames(buildReportCustomerNamesList(response))
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false))
  }, [])

  const handleCustomerChange = (customerId: string) => {
    getCustomerPayments(customerId).then((response: CustomerPayment[]) => {
      setPaymentsByCustomer(response.map((entryData) => CustomerPayment.buildFromData(entryData)))
    })
  }

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && (
        <ReportPaymentsByCustomerTab
          customerNames={customerNames}
          paymentsByCustomer={paymentsByCustomer}
          onCustomerChange={handleCustomerChange}
        />
      )}
    </>
  )
}
