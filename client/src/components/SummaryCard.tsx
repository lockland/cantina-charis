import { Box, Text, Title, NumberInput, Group, Popover } from "@mantine/core"
import { KeyboardEvent } from "react"
import { HelpIcon } from "./pages/cash/HelpIcon"
import { RealIcon } from "./pages/cash/RealIcon"

interface SummaryCardProps {
  title: string,
  amount?: number,
  readonly?: boolean
  placeholder?: string
  description?: string

  onBlur?: any
  onChange?: any
}

function SummaryCard(
  { description, placeholder, title, amount, readonly, onBlur, onChange }: SummaryCardProps
) {

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if ('Enter' === event.code) {
      event.preventDefault()
    }
  }

  return (
    <Box bg="var(--orders-card-background-color)" p={4}>
      <Popover width={300}>
        <Popover.Target>
          <Title order={4} align="center">{title} {(description) ? <HelpIcon /> : ""}</Title>
        </Popover.Target>
        <Popover.Dropdown>
          <Text size="sm" color="black">{description}</Text>
        </Popover.Dropdown>
      </Popover>
      <Group position="center">
        <NumberInput
          icon={<RealIcon />}
          value={amount}
          readOnly={readonly}
          placeholder={placeholder}
          onBlur={onBlur}
          onChange={onChange}
          hideControls
          precision={2}
          onKeyDown={handleKeyDown}
          decimalSeparator=','
          thousandsSeparator='.'
        />
      </Group>
    </Box>
  )
}

export default SummaryCard