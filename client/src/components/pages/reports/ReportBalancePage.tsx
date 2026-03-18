import { Text } from "@mantine/core"
import { useEffect, useState } from "react"
import BackToReportsLink from "./BackToReportsLink"
import { getBalance } from "../../../hooks/useAPI"
import DailyBalanceEntry from "../../../models/DailyBalance"
import ReportBalanceTab from "./ReportBalanceTab"

export default function ReportBalancePage() {
  const [balance, setBalance] = useState<DailyBalanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getBalance(7)
      .then((response: unknown) => {
        const list = Array.isArray(response)
          ? response.map((entryData) => DailyBalanceEntry.buildFromData(entryData as Parameters<typeof DailyBalanceEntry.buildFromData>[0]))
          : []
        setBalance(list)
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <BackToReportsLink />
      {loading && <Text c="dimmed">Carregando...</Text>}
      {error && <Text c="red" mb="md">{error}</Text>}
      {!loading && !error && <ReportBalanceTab balance={balance} />}
    </>
  )
}
