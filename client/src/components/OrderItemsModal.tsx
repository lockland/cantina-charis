import { Box, Modal } from "@mantine/core"
import { OrderProductsListContent, type OrderProductsSlice } from "./OrderProductsList"

interface OrderItemsModalProps {
  opened: boolean
  onClose: () => void
  title: string
  slices: OrderProductsSlice[]
}

/**
 * Modal sóbrio: um único fundo branco (sem “caixa dentro de caixa”),
 * sombra e borda leves; contraste com o tema global azul do Modal.
 */
export function OrderItemsModal({ opened, onClose, title, slices }: OrderItemsModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      size="sm"
      radius="md"
      padding="lg"
      overlayProps={{ opacity: 0.35, blur: 0 }}
      styles={{
        content: {
          backgroundColor: "#ffffff !important",
          boxShadow: "0 12px 40px rgba(15, 23, 42, 0.12)",
          border: "1px solid rgba(15, 23, 42, 0.06)",
        },
        header: {
          backgroundColor: "#ffffff !important",
          marginBottom: 0,
          paddingBottom: "var(--mantine-spacing-sm)",
        },
        title: {
          color: "#111827",
          fontWeight: 600,
          fontSize: "1.05rem",
          lineHeight: 1.35,
          paddingRight: "2rem",
        },
        /* Tema global pinta Modal com --generic-blue; o body precisa de fundo explícito. */
        body: {
          backgroundColor: "#ffffff !important",
          color: "#1f2937",
          /* Mantine zera paddingTop do body quando existe header; forçar respiro título → lista */
          paddingTop: "1.25rem !important",
        },
        close: {
          color: "#6b7280",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          },
        },
      }}
    >
      <Box style={{ backgroundColor: "#ffffff", color: "#1f2937" }}>
        <OrderProductsListContent slices={slices} />
      </Box>
    </Modal>
  )
}
