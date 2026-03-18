import {
  Flex,
  Paper,
  Stack,
  Group,
  Box,
  Text,
  Title,
} from "@mantine/core"
import { Link } from "react-router-dom"
import {
  GraphIcon,
  NumberIcon,
  PersonIcon,
  PackageIcon,
  CreditCardIcon,
} from "@primer/octicons-react"

const reports = [
  { path: "summary", label: "Sumário de eventos", icon: GraphIcon },
  { path: "balance", label: "Balanço últimos 7 dias", icon: NumberIcon },
  { path: "payments-by-customer", label: "Pedidos pagos por cliente", icon: PersonIcon },
  { path: "sold-products", label: "Produtos vendidos", icon: PackageIcon },
  { path: "outgoings", label: "Despesas do evento", icon: CreditCardIcon },
]

const CARD_SIZE_PX = 350
const CARD_GAP = 20

export default function ReportsIndex() {
  return (
    <Stack spacing="xl">
      <div>
        <Title order={1} mb="lg">
          Relatórios
        </Title>
        <Text c="dimmed" size="sm" mb="xl">
          Escolha um relatório para visualizar.
        </Text>
      </div>
      <Flex wrap="wrap" gap={CARD_GAP} m="md">
        {reports.map((r) => {
          const Icon = r.icon
          return (
            <Paper
              key={r.path}
              component={Link}
              to={`/reports/${r.path}`}
              p="lg"
              w={CARD_SIZE_PX}
              maw={CARD_SIZE_PX}
              bg="var(--orders-card-background-color)"
              radius="md"
              shadow="sm"
              styles={(theme) => ({
                root: {
                  boxSizing: "border-box",
                  textDecoration: "none",
                  color: "inherit",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                  transition: `transform 0.2s ${theme.transitionTimingFunction}, box-shadow 0.2s ${theme.transitionTimingFunction}`,
                  zIndex: 0,
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                    zIndex: 1,
                  },
                },
              })}
            >
              <Stack spacing="sm">
                <Group spacing="md" noWrap>
                  <Box
                    p="xs"
                    w={44}
                    h={44}
                    bg="rgba(255,255,255,0.2)"
                    style={{ borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <Icon size={22} />
                  </Box>
                  <Text fw={600} size="md" lineClamp={2} style={{ color: "#1a1a1a" }}>
                    {r.label}
                  </Text>
                </Group>
                <Text size="xs" style={{ color: "rgba(0,0,0,0.6)" }}>
                  Ver relatório →
                </Text>
              </Stack>
            </Paper>
          )
        })}
      </Flex>
    </Stack>
  )
}
