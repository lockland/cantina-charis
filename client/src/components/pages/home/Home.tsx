
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { COOKIE_NAME } from "../../../App";
import { isEventCreated } from "../../../hooks/useCookiesHook"

function Home() {
  const isCreated = isEventCreated(COOKIE_NAME)
  return (
    (isCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
