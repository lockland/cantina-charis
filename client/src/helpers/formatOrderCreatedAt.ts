/** Data/hora de criação (pt-BR, com segundos). */
export function formatOrderCreatedAt(createdAt: string): string {
  const d = new Date(createdAt)
  if (Number.isNaN(d.getTime())) {
    return createdAt
  }
  const raw = d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
  // Espaço inquebrável após a vírgula (data , hora) para não partir em duas linhas no cartão.
  return raw.replace(/,\s+/, ",\u00a0")
}
