import { Text } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getAllEvents, getOutgoingsByEvent } from "../../../hooks/useAPI"
import DecimalFormatter from "../../../helpers/Decimal"
import { OutgoingRow, buildOutgoingsRows } from "./outgoingsReport"
import ReportOutgoingsTab from "./ReportOutgoingsTab"

export default function ReportOutgoingsPage() {
  const [eventOptions, setEventOptions] = useState<{ value: string; label: string }[]>([])
  const [outgoingsRows, setOutgoingsRows] = useState<OutgoingRow[]>([])
  const [outgoingsTotal, setOutgoingsTotal] = useState<string>("R$ 0,00")
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
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && (
        <ReportOutgoingsTab
          eventOptions={eventOptions}
          outgoingsRows={outgoingsRows}
          outgoingsTotal={outgoingsTotal}
          onEventSelect={handleOutgoingsEventSelect}
        />
      )}
    </>
  )
}
