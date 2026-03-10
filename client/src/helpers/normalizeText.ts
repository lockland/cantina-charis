/**
 * Remove acentos e normaliza para comparação de busca.
 * Ex.: "café" -> "cafe", permitindo encontrar digitando "cafe".
 */
export function normalizeForSearch(str: string | undefined | null): string {
  const s = str != null ? String(str) : ""
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
}
