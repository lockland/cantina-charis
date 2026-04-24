import type { MantineThemeOverride } from "@mantine/core"
import { mantineThemeComponents } from "./theme-components"

export const theme: MantineThemeOverride = {
  other: {
    ordersCardBackground: "var(--orders-card-background-color)",
    secondaryBackground: "var(--secondary-background-color)",
  },
  components: mantineThemeComponents,
}
