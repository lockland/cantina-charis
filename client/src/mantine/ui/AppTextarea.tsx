import type { MantineTheme } from "@mantine/core"
import { Textarea, type TextareaProps } from "@mantine/core"
import { appFormLabelOnlyStyles } from "./formFieldStyles"

export function AppTextarea({ styles, ...props }: TextareaProps) {
  return (
    <Textarea
      {...props}
      styles={(theme: MantineTheme, params, context) => {
        const extra =
          typeof styles === "function"
            ? styles(theme, params, context)
            : styles ?? {}
        return {
          label: { ...appFormLabelOnlyStyles.label, ...extra.label },
          ...(extra.input ? { input: extra.input } : {}),
        }
      }}
    />
  )
}
