import { Button } from "@mantine/core"
import { Link } from "react-router-dom"

export default function BackToReportsLink() {
  return (
    <Button
      component={Link}
      to="/reports"
      variant="light"
      w="fit-content"
      size="sm"
      radius="md"
      mb="md"
      c="dark.7"
      styles={(theme) => ({
        root: {
          backgroundColor: theme.other?.secondaryBackground as string,
        },
      })}
    >
      ← Voltar aos relatórios
    </Button>
  )
}
