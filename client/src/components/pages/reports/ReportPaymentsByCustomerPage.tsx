import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getCustomerNames, getCustomerConsumption } from "../../../hooks/useAPI"
import { CustomerNamesOptionType, CustomerType } from "../../../models/Customer"
import { buildReportCustomerNamesList } from "../../../helpers/SelectLists"
import CustomerConsumption from "../../../models/CustomerPayment"
import ReportConsumptionByCustomerTab from "./ReportPaymentsByCustomerTab"

export default function ReportConsumptionByCustomerPage() {
  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([])
  const [consumptionByCustomer, setConsumptionByCustomer] = useState<CustomerConsumption[]>([])
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

  const handleCustomerChange = (customerId: string | null) => {
    if (!customerId) return
    getCustomerConsumption(customerId).then((response: CustomerConsumption[]) => {
      setConsumptionByCustomer(response.map((entryData) => CustomerConsumption.buildFromData(entryData)))
    })
  }

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && (
        <ReportConsumptionByCustomerTab
          customerNames={customerNames}
          consumptionByCustomer={consumptionByCustomer}
          onCustomerChange={handleCustomerChange}
        />
      )}
    </>
  )
}
