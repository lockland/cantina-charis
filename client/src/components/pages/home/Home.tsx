
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { useSharedContext } from "../../../hooks/useSharedContext"
import { Center, Loader } from "@mantine/core"

function Home() {

  const { homePage, setHomePage, openEventHydrated } = useSharedContext()

  if (!openEventHydrated) {
    return (
      <Center h="70vh">
        <Loader size="lg" />
      </Center>
    )
  }

  if (homePage === "cashpage") return <CashPage />
  if (homePage === "initial") return <InitialPage setOpened={setHomePage} />
}

export default Home
