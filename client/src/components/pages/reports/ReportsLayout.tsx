import { Stack } from "@mantine/core"
import { Outlet } from "react-router-dom"

export default function ReportsLayout() {
  return (
    <Stack p="md" spacing="md">
      <Outlet />
    </Stack>
  )
}
