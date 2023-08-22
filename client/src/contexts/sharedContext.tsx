import { ReactNode, createContext, useState } from "react";
import OrderItemRow from "../models/OrderItemRow";

interface ContextProps {
  orderAmount: number,
  orderItemList: OrderItemRow[],

  setOrderAmount(value: number): void
  setOrderItemList(value: any): void
}


export const SharedContext = createContext<ContextProps>({
  orderAmount: 0.00,
  orderItemList: [],
  setOrderAmount: () => { },
  setOrderItemList: () => { }
})

export function SharedContextProvider({ children }: { children: ReactNode }) {
  const [orderAmount, setOrderAmount] = useState(0.00)
  const [orderItemList, setOrderItemList] = useState<OrderItemRow[]>([])

  return (
    <SharedContext.Provider
      value={{
        orderAmount,
        setOrderAmount,
        orderItemList,
        setOrderItemList
      }}
    >
      {children}
    </ SharedContext.Provider>
  )
}