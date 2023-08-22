import { useCookies } from "react-cookie";
import { COOKIE_NAME } from "../App";


export function useCookiesHook() {
  const cookieName: string = COOKIE_NAME

  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const isEventCreated = (function (cookieName: string): boolean {
    const cookieValues = cookies[cookieName]
    return cookieValues?.event_created || false
  }(cookieName))

  const setCookieWithExpire = (value: string, expireTimestamp: number): void => {
    setCookie(cookieName, value, { expires: new Date(expireTimestamp) })
  }

  const removeAppCookie = () => {
    removeCookie(cookieName)
  }

  const setAppCookie = (content: string) => {
    setCookie(cookieName, content)
  }

  return {
    cookies,
    setAppCookie,
    removeAppCookie,
    setCookieWithExpire,
    isEventCreated
  }
}