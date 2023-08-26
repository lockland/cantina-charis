
import InitialPage from "./InitialPage";
import CashPage from "../cash/Cash"
import { useCookiesHook } from "../../../hooks/useCookiesHook"
import { useEffect, useState } from "react";
import { getOpenEvent } from "../../../hooks/useAPI";

function Home() {
  const { isEventCreated, setEventData, removeAppCookie } = useCookiesHook()
  const [opened, setOpened] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getOpenEvent()
      if (event.event_id > 0) {
        setEventData(event)
        setOpened(true)
      } else {
        removeAppCookie()
        setOpened(false)
      }
    }

    fetchEvent()
  }, [opened])

  return (
    (opened || isEventCreated) ? <CashPage /> : <InitialPage setOpened={setOpened} />
  );
}

export default Home
