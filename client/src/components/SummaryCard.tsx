import { Box, TextInput, Title } from "@mantine/core"

interface SummaryCardProps {
  title: string,
  price: string,
}

function SummaryCard({ title, price }: SummaryCardProps) {
  return (
    <Box bg="var(--orders-card-background-color)" p={4} >
      <Title order={4} align="center">{title}</Title>
      {(parseInt(price) <= 0) ?
        <TextInput defaultValue={`${price}`} /> :
        <TextInput defaultValue={`R$ ${price}`} readOnly />}
    </Box>
  )
}

export default SummaryCard