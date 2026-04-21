import type { MantineTheme } from "@mantine/core"
import { Checkbox, type CheckboxProps } from "@mantine/core"
import { appFormLabelOnlyStyles } from "./formFieldStyles"

export function AppCheckbox({ styles, ...props }: CheckboxProps) {
  return (
    <Checkbox
      {...props}
      styles={(theme: MantineTheme, params, context) => {
        const extra =
          typeof styles === "function"
            ? styles(theme, params, context)
            : styles ?? {}
        return {
          label: { ...appFormLabelOnlyStyles.label, ...extra.label },
        }
      }}
    />
  )
}
