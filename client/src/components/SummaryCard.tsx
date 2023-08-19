import { Box, Text, Flex, Title, Center, NumberInput } from "@mantine/core"

interface SummaryCardProps {
  title: string,
  amount?: number,
  readonly?: boolean
  placeholder?: string

  onBlur?: any
  onChange?: any
}

function SummaryCard({ placeholder, title, amount, readonly, onBlur, onChange }: SummaryCardProps) {
  return (
    <Box bg="var(--orders-card-background-color)" p={4} >
      <Title order={4} align="center">{title}</Title>
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
          />
        </Flex>
      </Center>
    </Box>
  )
}

export default SummaryCard