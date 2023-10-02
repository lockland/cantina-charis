
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { useCookiesHook } from "../../../hooks/useCookiesHook"
import { useEffect, useState } from "react";
import { getOpenEvent } from "../../../hooks/useAPI";
import Event from "../../../models/Event";

function Home() {
  const { setEventData, removeAppCookie } = useCookiesHook()
  const [opened, setOpened] = useState("")

  useEffect(() => {
    getOpenEvent().then((event: Event) => {
      if (event.event_id > 0) {
        setEventData(event)
        setOpened("cashpage")
      } else {
        removeAppCookie()
        setOpened("initial")
      }
    })
  }, [opened])

  if (opened === "cashpage") return <CashPage />
  if (opened === "initial") return <InitialPage setOpened={setOpened} />
}

export default Home
