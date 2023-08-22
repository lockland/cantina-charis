
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { COOKIE_NAME } from "../../../App";
import { useCookiesHook } from "../../../hooks/useCookiesHook"

function Home() {
  const { isEventCreated } = useCookiesHook(COOKIE_NAME)
  return (
    (isEventCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
