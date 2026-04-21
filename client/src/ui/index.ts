/**
 * Camada de UI da aplicação: fachada sobre Mantine (v6 hoje).
 *
 * - Importe **daqui** componentes de formulário, moeda e hooks que quisermos estáveis.
 * - Bootstrap do Mantine (`AppMantineProvider`, `theme`) fica em `src/mantine/`.
 * - Layout “cru” (`Box`, `Stack`, …) pode continuar a vir de `@mantine/core` até existir wrapper.
 *
 * Trocar de biblioteca de componentes: reimplementar os módulos em `mantine/ui/` (ou mover
 * implementação para `ui/`) mantendo as props usadas no restante do código.
 */

export * from "../mantine/ui"
export { CurrencyNumberInput } from "../mantine/CurrencyNumberInput"
export * from "../mantine/form"
export * from "../mantine/hooks"
export * from "../mantine/notifications"
