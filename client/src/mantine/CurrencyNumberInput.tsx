import type { NumberInputProps } from "@mantine/core"
import { AppNumberInput } from "./ui/AppNumberInput"

type Props = Omit<
  NumberInputProps,
  "precision" | "hideControls" | "decimalSeparator" | "thousandsSeparator"
>

/**
 * Valores em Real (pt-BR): 2 casas, vírgula decimal, ponto milhar.
 * Mantine v7: renomear aqui para `decimalScale`, `thousandSeparator`, `leftSection` (ex-icon).
 */
export function CurrencyNumberInput(props: Props) {
  return (
    <AppNumberInput
      hideControls
      precision={2}
      decimalSeparator=","
      thousandsSeparator="."
      {...props}
    />
  )
}
