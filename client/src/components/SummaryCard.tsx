import { Box, Text, Flex, Title, Center, NumberInput } from "@mantine/core"
import { KeyboardEvent } from "react"
import { HelpIcon } from "./pages/cash/HelpIcon"

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
    <Box bg="var(--orders-card-background-color)" p={4} >
      <Title order={4} align="center">{title}
        {(description) ? <span title={description}><HelpIcon /></span> : ""}
      </Title>
      <Center>
        <Flex
          align="center"
        >
          <Text size="sm" color="black" bg="white" p={7}>R$</Text>
          <NumberInput
            value={amount}
            readOnly={readonly}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
            hideControls
            precision={2}
            onKeyDown={handleKeyDown}
          />
        </Flex>
      </Center>
    </Box>
  )
}

export default SummaryCard