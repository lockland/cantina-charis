import { ReactNode, createContext, useState } from "react";
import OrderItemRow from "../models/OrderItemRow";

interface ContextProps {
  orderAmount: number,
  orderItemList: OrderItemRow[],
  homePage: string,

  setOrderAmount(value: number): void
  setOrderItemList(value: any): void
  setHomePage(value: string): void
}


export const SharedContext = createContext<ContextProps>({
  orderAmount: 0.00,
  orderItemList: [],
  homePage: "",
  setOrderAmount: () => { },
  setOrderItemList: () => { },
  setHomePage: () => { }
})

export function SharedContextProvider({ children }: { children: ReactNode }) {
  const [orderAmount, setOrderAmount] = useState(0.00)
  const [orderItemList, setOrderItemList] = useState<OrderItemRow[]>([])
  const [homePage, setHomePage] = useState("")

  return (
    <SharedContext.Provider
      value={{
        orderAmount,
        setOrderAmount,
        orderItemList,
        setOrderItemList,
        homePage,
        setHomePage
      }}
    >
      {children}
    </ SharedContext.Provider>
  )
}