export interface OutgoingRow {
  event_name: string
  created_at: string
  description: string
  amount: number
}

export interface OutgoingForReport {
  created_at: string
  outgoing_description?: string
  outgoing_amount?: unknown
}

/** Resposta do GET /api/reports/outgoings?from=&to= */
export interface OutgoingReportItem {
  event_name: string
  created_at: string
  description: string
  amount: number
}

export function buildOutgoingsRows(
  outgoings: OutgoingForReport[],
  eventName: string
): { rows: OutgoingRow[]; total: number } {
  const rows: OutgoingRow[] = []
  let total = 0
  for (const o of outgoings) {
    const amount = parseFloat(String(o.outgoing_amount ?? 0))
    total += amount
    rows.push({
      event_name: eventName,
      created_at: o.created_at,
      description: o.outgoing_description ?? "",
      amount,
    })
  }
  return { rows, total }
}

export function buildOutgoingsRowsFromReport(
  items: OutgoingReportItem[]
): { rows: OutgoingRow[]; total: number } {
  const rows: OutgoingRow[] = []
  let total = 0
  for (const o of items) {
    const amount = typeof o.amount === 'number' ? o.amount : parseFloat(String(o.amount ?? 0))
    total += amount
    rows.push({
      event_name: o.event_name,
      created_at: o.created_at,
      description: o.description ?? "",
      amount,
    })
  }
  return { rows, total }
}
