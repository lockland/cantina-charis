/**
 * Menu ⋮ nos cards de pedidos: transparente, com hover suave (Mantine ActionIcon variant="transparent").
 */

/** Largura da coluna lateral em layout flex (espelha o ActionIcon size="lg"). */
export const ORDERS_CARD_MENU_RAIL_PX = 44

export function ordersCardMenuActionIconStyles(cardIsPaid: boolean) {
  if (cardIsPaid) {
    return {
      root: {
        color: "var(--orders-card-paid-secondary)",
        "&:hover": {
          backgroundColor: "rgba(0, 0, 0, 0.06)",
        },
      },
    }
  }

  return {
    root: {
      color: "var(--orders-card-on-teal-primary)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.14)",
      },
    },
  }
}
