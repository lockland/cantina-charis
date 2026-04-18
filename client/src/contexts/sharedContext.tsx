import { ReactNode, createContext, useState } from "react";
import OrderItemRow from "../models/OrderItemRow";
import Event from "../models/Event";

interface ContextProps {
  orderAmount: number,
  orderItemList: OrderItemRow[],
  homePage: string,
  role: string,
  openEvent: Event,
  openEventHydrated: boolean,

  setOrderAmount(value: number): void
  setOrderItemList(value: any): void
  setHomePage(value: string): void
  setRole(value: string): void
  setOpenEvent(value: Event): void
  setOpenEventHydrated(value: boolean): void
}


export const SharedContext = createContext<ContextProps>({
  orderAmount: 0.00,
  orderItemList: [],
  homePage: "",
  role: "",
  openEvent: new Event(),
  openEventHydrated: false,
  setOrderAmount: () => { },
  setOrderItemList: () => { },
  setHomePage: () => { },
  setRole: () => { },
  setOpenEvent: () => { },
  setOpenEventHydrated: () => { },
})

export function SharedContextProvider({ children }: { children: ReactNode }) {
  const [orderAmount, setOrderAmount] = useState(0.00)
  const [orderItemList, setOrderItemList] = useState<OrderItemRow[]>([])
  const [homePage, setHomePage] = useState("")
  const [role, setRole] = useState("")
  const [openEvent, setOpenEvent] = useState<Event>(() => new Event())
  const [openEventHydrated, setOpenEventHydrated] = useState(false)

  return (
    <SharedContext.Provider
      value={{
        orderAmount,
        setOrderAmount,
        orderItemList,
        setOrderItemList,
        homePage,
        setHomePage,
        role,
        setRole,
        openEvent,
        openEventHydrated,
        setOpenEvent,
        setOpenEventHydrated,
      }}
    >
      {children}
    </SharedContext.Provider>
  )
}
