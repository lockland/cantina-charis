import type { MantineTheme } from "@mantine/core"
import { DatePickerInput } from "@mantine/dates"
import type { DatePickerInputProps, DatePickerType } from "@mantine/dates"
import { appDatePickerFieldStyles } from "./formFieldStyles"

export function AppDatePickerInput<Type extends DatePickerType = "default">(
  props: DatePickerInputProps<Type>
) {
  const { styles, ...rest } = props
  return (
    <DatePickerInput
      {...rest}
      styles={(theme: MantineTheme, params, context) => {
        const extra =
          typeof styles === "function"
            ? styles(theme, params, context)
            : styles ?? {}
        return {
          label: { ...appDatePickerFieldStyles.label, ...extra.label },
          input: { ...appDatePickerFieldStyles.input, ...extra.input },
          ...(extra.calendar ? { calendar: extra.calendar } : {}),
        }
      }}
    />
  )
}
