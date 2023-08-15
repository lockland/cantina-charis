
import "./Home.css"
import InitialPage from "./InitialPage";
import CashPage from "./Cash"

const alreadCreated = false

function Home() {

  return (
    (alreadCreated) ? <CashPage /> : <InitialPage />
  );
}

export default Home
