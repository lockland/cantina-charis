import { Text } from "@mantine/core"
import { useCallback, useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getOutgoingsByDateRange } from "../../../hooks/useAPI"
import DecimalFormatter from "../../../helpers/Decimal"
import { OutgoingRow, buildOutgoingsRowsFromReport } from "./outgoingsReport"
import ReportOutgoingsTab from "./ReportOutgoingsTab"

function formatDateForApi(d: Date): string {
  return d.toISOString().slice(0, 10)
}

export default function ReportOutgoingsPage() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [outgoingsRows, setOutgoingsRows] = useState<OutgoingRow[]>([])
  const [outgoingsTotal, setOutgoingsTotal] = useState<string>("R$ 0,00")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOutgoings = useCallback(async (from: Date, to: Date) => {
    setLoading(true)
    setError(null)
    try {
      const fromStr = formatDateForApi(from)
      const toStr = formatDateForApi(to)
      const items = await getOutgoingsByDateRange(fromStr, toStr)
      const { rows, total } = buildOutgoingsRowsFromReport(items)
      setOutgoingsRows(rows)
      setOutgoingsTotal(DecimalFormatter.format(total))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar despesas")
      setOutgoingsRows([])
      setOutgoingsTotal(DecimalFormatter.format(0))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const [from, to] = dateRange
    if (from && to) {
      fetchOutgoings(from, to)
    } else {
      setOutgoingsRows([])
      setOutgoingsTotal(DecimalFormatter.format(0))
    }
  }, [dateRange, fetchOutgoings])

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      <ReportOutgoingsTab
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        outgoingsRows={outgoingsRows}
        outgoingsTotal={outgoingsTotal}
      />
    </>
  )
}
