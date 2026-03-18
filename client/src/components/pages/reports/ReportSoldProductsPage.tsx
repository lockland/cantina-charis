import { Text } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getAllEvents, getOrders } from "../../../hooks/useAPI"
import DecimalFormatter from "../../../helpers/Decimal"
import { SoldProductRow, buildSoldProductRows } from "./soldProductsReport"
import ReportSoldProductsTab from "./ReportSoldProductsTab"

export default function ReportSoldProductsPage() {
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([])
  const [soldProductsRows, setSoldProductsRows] = useState<SoldProductRow[]>([])
  const [soldProductsTotal, setSoldProductsTotal] = useState<string>("R$ 0,00")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAllEvents()
      .then((response: { event_id: number; event_name: string }[]) => {
        setEventOptions(response.map((e) => ({ value: String(e.event_id), label: e.event_name })))
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false))
  }, [])

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

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && (
        <ReportSoldProductsTab
          eventOptions={eventOptions}
          soldProductsRows={soldProductsRows}
          soldProductsTotal={soldProductsTotal}
          onEventSelect={handleEventSelect}
        />
      )}
    </>
  )
}
