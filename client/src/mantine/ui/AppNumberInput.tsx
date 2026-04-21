import type { MantineTheme } from "@mantine/core"
import { NumberInput, type NumberInputProps } from "@mantine/core"
import { appFormFieldStyles } from "./formFieldStyles"

export function AppNumberInput({ styles, ...props }: NumberInputProps) {
  return (
    <NumberInput
      {...props}
      styles={(theme: MantineTheme, params, context) => {
        const extra =
          typeof styles === "function"
            ? styles(theme, params, context)
            : styles ?? {}
        return {
          label: { ...appFormFieldStyles.label, ...extra.label },
          input: { ...appFormFieldStyles.input, ...extra.input },
        }
      }}
    />
  )
}
