import type { MantineTheme } from "@mantine/core"
import { Select, type SelectProps } from "@mantine/core"
import { appFormFieldStyles } from "./formFieldStyles"

export function AppSelect({ styles, ...props }: SelectProps) {
  return (
    <Select
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
