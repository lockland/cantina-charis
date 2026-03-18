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
