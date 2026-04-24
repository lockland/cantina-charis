import type { ReactNode } from "react"
import { MantineProvider } from "@mantine/core"
import { DatesProvider } from "@mantine/dates"
import { Notifications } from "@mantine/notifications"
import { theme } from "./theme"

export function AppMantineProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider withNormalizeCSS withCSSVariables inherit theme={theme}>
      <DatesProvider settings={{ locale: "pt-br", firstDayOfWeek: 0 }}>
        <Notifications position="top-right" zIndex={4000} limit={5} />
        {children}
      </DatesProvider>
    </MantineProvider>
  )
}
