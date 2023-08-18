import { Box, Text, Flex, TextInput, Title, Center } from "@mantine/core"

interface SummaryCardProps {
  title: string,
  amount?: string,
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
          <TextInput
            value={amount}
            readOnly={readonly}
            placeholder={placeholder}
            onBlur={onBlur}
            onChange={onChange}
          />
        </Flex>
      </Center>
    </Box>
  )
}

export default SummaryCard