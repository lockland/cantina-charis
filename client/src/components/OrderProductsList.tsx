import { Group, Stack, Text } from "@mantine/core"
import type { ProductType } from "../models/Product"

export interface OrderProductsSlice {
  orderId: number
  items: ProductType[]
}

const nameColor = "#1f2937"
const qtyColor = "#475569"
const emptyColor = "#64748b"

function aggregateItems(slices: OrderProductsSlice[]): { productId: number; quantity: number; name: string }[] {
  const map = new Map<number, { quantity: number; name: string }>()

  for (const slice of slices) {
    for (const item of slice.items ?? []) {
      const id = item.product_id
      const q = Number(item.quantity) || 0
      const name = item.product?.product_name?.trim() || "Produto"
      const prev = map.get(id)
      if (prev) {
        map.set(id, { quantity: prev.quantity + q, name: prev.name })
      } else {
        map.set(id, { quantity: q, name })
      }
    }
  }

  return Array.from(map.entries())
    .map(([productId, { quantity, name }]) => ({ productId, quantity, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }))
}

/** Lista agregada: uma linha por produto, nome à esquerda e quantidade à direita. */
export function OrderProductsListContent({ slices }: { slices: OrderProductsSlice[] }) {
  const hasAny = slices.some((s) => (s.items?.length ?? 0) > 0)
  if (!hasAny) {
    return (
      <Text size="sm" style={{ color: emptyColor }}>
        Nenhum item neste pedido.
      </Text>
    )
  }

  const lines = aggregateItems(slices)

  return (
    <Stack spacing="xs">
      {lines.map((line) => (
        <Group key={line.productId} position="apart" align="flex-start" noWrap spacing="md">
          <Text size="sm" lh={1.45} style={{ color: nameColor, flex: 1 }}>
            {line.name}
          </Text>
          <Text size="sm" fw={700} ta="right" style={{ color: qtyColor, fontVariantNumeric: "tabular-nums" }}>
            {line.quantity}×
          </Text>
        </Group>
      ))}
    </Stack>
  )
}
