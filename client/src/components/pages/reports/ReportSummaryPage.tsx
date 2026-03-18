import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import { getEventsSummary } from "../../../hooks/useAPI"
import ReportEntry from "../../../models/ReportEntry"
import ReportEntries from "../../../models/ReportsEntries"
import ReportSummariesTab from "./ReportSummariesTab"
import BackToReportsLink from "./BackToReportsLink"

export default function ReportSummaryPage() {
  const [summaryRows, setSummaryRows] = useState(new ReportEntries())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getEventsSummary()
      .then((response: unknown) => {
        const list = new ReportEntries()
        if (Array.isArray(response)) {
          response.forEach((entryData) => list.push(ReportEntry.buildFromData(entryData as Parameters<typeof ReportEntry.buildFromData>[0])))
        }
        setSummaryRows(list)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && <ReportSummariesTab summaryRows={summaryRows} />}
    </>
  )
}
