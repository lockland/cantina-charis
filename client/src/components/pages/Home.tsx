
import InitialPage from "./InitialPage";
import CashPage from "./Cash"
import { useCookies } from "react-cookie";
import { COOKIE_NAME } from "../../App";

function Home() {
  const [cookies, setCookie] = useCookies([COOKIE_NAME]);

  const alreadCreated = !!cookies[COOKIE_NAME]

  return (
    (alreadCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
