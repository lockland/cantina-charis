
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { useSharedContext } from "../../../hooks/useSharedContext"

function Home() {

  const { homePage, setHomePage } = useSharedContext()

  if (homePage === "cashpage") return <CashPage />
  if (homePage === "initial") return <InitialPage setOpened={setHomePage} />
}

export default Home
