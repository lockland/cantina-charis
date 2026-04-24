import type { ButtonStylesParams, MantineThemeOverride } from "@mantine/core"

const labelMain = { color: "var(--main-color)" }
const bgGenericBlue = { backgroundColor: "var(--generic-blue)" }

/** Campos de formulário: usar `AppTextInput`, `AppSelect`, etc. em `mantine/ui`. */
export const mantineThemeComponents: NonNullable<MantineThemeOverride["components"]> = {
  Accordion: {
    styles: {
      panel: bgGenericBlue,
      control: bgGenericBlue,
      item: { ...bgGenericBlue, border: "none", color: "var(--main-color)" },
      label: labelMain,
    },
  },
  Modal: {
    styles: {
      content: bgGenericBlue,
      header: { ...bgGenericBlue, color: "var(--main-color)" },
    },
  },
  Button: {
    styles: (_theme, _params: ButtonStylesParams, { variant }) => ({
      root: {
        backgroundColor: variant === "filled" ? "var(--button-color)" : undefined,
      },
    }),
  },
  Tabs: {
    styles: () => ({
      tab: {
        backgroundColor: "var(--secondary-background-color)",
        fontSize: "1.5rem",
      },
    }),
  },
}
