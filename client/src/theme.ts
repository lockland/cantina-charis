import type { ButtonStylesParams, MantineThemeOverride } from "@mantine/core"

// Estilos compartilhados (variáveis do projeto em index.css)
const labelMain = { color: "var(--main-color)" }
const inputNoBorder = { border: "none" as const, borderRadius: 0 }
const bgGenericBlue = { backgroundColor: "var(--generic-blue)" }

/** Componentes que têm label + input: mesmo label, input sem borda; opcional extra no input. */
function inputLike(extraInput: Record<string, unknown> = {}) {
  return {
    styles: () => ({
      label: labelMain,
      input: { ...inputNoBorder, ...extraInput },
    }),
  }
}

/** Só label com cor principal (Checkbox, Textarea). */
const labelOnly = {
  styles: () => ({ label: labelMain }),
}

export const theme: MantineThemeOverride = {
  other: {
    ordersCardBackground: "var(--orders-card-background-color)",
    secondaryBackground: "var(--secondary-background-color)",
  },
  components: {
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
    TextInput: inputLike(),
    NumberInput: inputLike(),
    Select: inputLike(),
    DatePickerInput: inputLike({ backgroundColor: "white" }),
    Checkbox: labelOnly,
    Textarea: labelOnly,
    Tabs: {
      styles: () => ({
        tab: {
          backgroundColor: "var(--secondary-background-color)",
          fontSize: "1.5rem",
        },
      }),
    },
  },
}
