
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { useCookiesHook } from "../../../hooks/useCookiesHook"

function Home() {
  const { isEventCreated } = useCookiesHook()
  return (
    (isEventCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
