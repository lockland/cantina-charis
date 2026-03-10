import { useCookies } from "react-cookie";
import { COOKIE_NAME } from "../App";
import { EventType } from "../models/Event";


export function useCookiesHook() {
  const cookieName: string = COOKIE_NAME

  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const parsedCookie = (function (cookieName: string): EventType | null {
    const raw = cookies[cookieName]
    if (raw == null) return null
    if (typeof raw === "string") {
      try {
        return JSON.parse(raw) as EventType
      } catch {
        return null
      }
    }
    return raw as EventType
  }(cookieName))

  const isEventCreated = (parsedCookie?.event_id ?? 0) > 0
  const eventId = parsedCookie?.event_id ?? 0

  const setCookieWithExpire = (value: string, expireTimestamp: number): void => {
    setCookie(cookieName, value, { expires: new Date(expireTimestamp) })
  }

  const removeAppCookie = () => {
    removeCookie(cookieName)
  }

  const setAppCookie = (content: string) => {
    setCookie(cookieName, content)
  }

  const setEventData = (eventData: EventType) => {
    const expireTimestamp = new Date().getTime() + (60 * 60 * 24 * 1000)
    setCookieWithExpire(JSON.stringify(eventData), expireTimestamp)
  }

  return {
    cookies,
    setAppCookie,
    removeAppCookie,
    setCookieWithExpire,
    isEventCreated,
    setEventData,
    eventId
  }
}