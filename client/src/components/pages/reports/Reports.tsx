import { Box, Tabs } from "@mantine/core"
import { getBalance, getCustomerNames, getCustomerPayments, getEventsSummary, getAllEvents, getOrders, getOutgoingsByEvent } from "../../../hooks/useAPI"
import ReportEntry from "../../../models/ReportEntry"
import { useCallback, useEffect, useState } from "react"
import ReportEntries from "../../../models/ReportsEntries"
import DailyBalanceEntry from "../../../models/DailyBalance"
import { CustomerNamesOptionType, CustomerType } from "../../../models/Customer"
import { buildReportCustomerNamesList } from "../../../helpers/SelectLists"
import CustomerPayment from "../../../models/CustomerPayment"
import DecimalFormatter from "../../../helpers/Decimal"
import { SoldProductRow, buildSoldProductRows } from "./soldProductsReport"
import { OutgoingRow, buildOutgoingsRows } from "./outgoingsReport"
import ReportSummariesTab from "./ReportSummariesTab"
import ReportBalanceTab from "./ReportBalanceTab"
import ReportPaymentsByCustomerTab from "./ReportPaymentsByCustomerTab"
import ReportSoldProductsTab from "./ReportSoldProductsTab"
import ReportOutgoingsTab from "./ReportOutgoingsTab"

function Reports() {
  const [summaryRows, setSummaryRows] = useState(new ReportEntries())
  const [balance, setBalance] = useState<DailyBalanceEntry[]>([])
  const [customerNames, setCustomerNames] = useState<CustomerNamesOptionType[]>([])
  const [paymentsByCustomer, setPaymentsByCustomer] = useState<CustomerPayment[]>([])
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([])
  const [soldProductsRows, setSoldProductsRows] = useState<SoldProductRow[]>([])
  const [soldProductsTotal, setSoldProductsTotal] = useState<string>("R$ 0,00")
  const [outgoingsRows, setOutgoingsRows] = useState<OutgoingRow[]>([])
  const [outgoingsTotal, setOutgoingsTotal] = useState<string>("R$ 0,00")

  useEffect(() => {
    getEventsSummary().then((response: ReportEntries) => {
      const list = new ReportEntries()
      response.map((entryData) => list.push(ReportEntry.buildFromData(entryData)))
      setSummaryRows(list)
    })
    getBalance(7).then((response: DailyBalanceEntry[]) => {
      const list = response.map((entryData) => DailyBalanceEntry.buildFromData(entryData))
      setBalance(list)
    })
    getCustomerNames().then((response: CustomerType[]) => {
      setCustomerNames(buildReportCustomerNamesList(response))
    })
    getAllEvents().then((response: { event_id: number; event_name: string }[]) => {
      setEventOptions(response.map((e) => ({ value: String(e.event_id), label: e.event_name })))
    })
  }, [])

  const handleCustomerChange = (customerId: string) => {
    getCustomerPayments(customerId).then((response: CustomerPayment[]) => {
      setPaymentsByCustomer(response.map((entryData) => CustomerPayment.buildFromData(entryData)))
    })
  }

  const handleEventSelect = useCallback(
    async (eventId: string | null) => {
      if (!eventId) return
      const eventName = eventOptions.find((o) => o.value === eventId)?.label ?? ""
      const orders = await getOrders(Number(eventId))
      const { rows, total } = buildSoldProductRows(orders, eventName)
      setSoldProductsRows(rows)
      setSoldProductsTotal(DecimalFormatter.format(total))
    },
    [eventOptions]
  )

  const handleOutgoingsEventSelect = useCallback(
    async (eventId: string | null) => {
      if (!eventId) return
      const eventName = eventOptions.find((o) => o.value === eventId)?.label ?? ""
      const outgoings = await getOutgoingsByEvent(Number(eventId))
      const { rows, total } = buildOutgoingsRows(outgoings, eventName)
      setOutgoingsRows(rows)
      setOutgoingsTotal(DecimalFormatter.format(total))
    },
    [eventOptions]
  )

  return (
    <Box p={7}>
      <Tabs defaultValue="first" variant="pills">
        <Tabs.List>
          <Tabs.Tab value="first">Sumário de eventos</Tabs.Tab>
          <Tabs.Tab value="second">Balanço últimos 7 dias</Tabs.Tab>
          <Tabs.Tab value="third">Pedidos pagos por cliente</Tabs.Tab>
          <Tabs.Tab value="fourth">Produtos vendidos</Tabs.Tab>
          <Tabs.Tab value="fifth">Despesas do evento</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="first">
          <ReportSummariesTab summaryRows={summaryRows} />
        </Tabs.Panel>
        <Tabs.Panel value="second">
          <ReportBalanceTab balance={balance} />
        </Tabs.Panel>
        <Tabs.Panel value="third">
          <ReportPaymentsByCustomerTab
            customerNames={customerNames}
            paymentsByCustomer={paymentsByCustomer}
            onCustomerChange={handleCustomerChange}
          />
        </Tabs.Panel>
        <Tabs.Panel value="fourth">
          <ReportSoldProductsTab
            eventOptions={eventOptions}
            soldProductsRows={soldProductsRows}
            soldProductsTotal={soldProductsTotal}
            onEventSelect={handleEventSelect}
          />
        </Tabs.Panel>
        <Tabs.Panel value="fifth">
          <ReportOutgoingsTab
            eventOptions={eventOptions}
            outgoingsRows={outgoingsRows}
            outgoingsTotal={outgoingsTotal}
            onEventSelect={handleOutgoingsEventSelect}
          />
        </Tabs.Panel>
      </Tabs>
    </Box>
  )
}

export default Reports
