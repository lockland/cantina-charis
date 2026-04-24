import type { MantineTheme } from "@mantine/core"
import { TextInput, type TextInputProps } from "@mantine/core"
import { appFormFieldStyles } from "./formFieldStyles"

export function AppTextInput({ styles, ...props }: TextInputProps) {
  return (
    <TextInput
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
