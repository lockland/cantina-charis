import Event, { EventType } from '../models/Event';
import { OutgoingType } from '../models/Outgoing';
import { useCookiesHook } from './useCookiesHook';

const fetcher = async (url: string, options: any = {}) => {
  return fetch(url, options)
    .then((r) => r.json())
}

export function getOpenEvent() {
  return fetcher("api/events?open=true")
    .then((events) => Event.buildFromData(events[0]))
    .catch(() => new Event)
}

export function createEvent(values: EventType) {
  return fetcher("api/events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}

export function closeEvent(eventId: number) {
  return fetcher(`api/events/${eventId}/close  `, { method: "PUT" })
}

export function createOutgoing(values: OutgoingType) {
  return fetcher("api/outgoings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  })
}
