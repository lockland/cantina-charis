import { useCookies } from "react-cookie";


export function useCookiesHook(cookieName: string) {
  const [cookies, setCookie, removeCookie] = useCookies([cookieName]);

  const isEventCreated = (function (cookieName: string): boolean {
    const cookieValues = cookies[cookieName]
    return cookieValues?.event_created || false
  }(cookieName))

  const setCookieWithExpire = (value: string, expireTimestamp: number): void => {
    setCookie(cookieName, value, { expires: new Date(expireTimestamp) })
  }

  return {
    cookies,
    setCookie,
    removeCookie,
    setCookieWithExpire,
    isEventCreated
  }
}