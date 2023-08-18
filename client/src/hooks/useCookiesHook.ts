import { useCookies } from "react-cookie";

export function isEventCreated(cookieName: string): boolean {
  const [cookies, _setCookie] = useCookies([cookieName]);
  const cookieValues = cookies[cookieName]
  return cookieValues?.event_created || false
}

export function useCookiesHook(cookieName: string): any {
  const [_cookies, setCookie] = useCookies([cookieName]);

  const setCookieWithExpire = (value: string, expireTimestamp: number) => {
    setCookie(cookieName, value, { expires: new Date(expireTimestamp) })
  }

  return [setCookieWithExpire]
}
