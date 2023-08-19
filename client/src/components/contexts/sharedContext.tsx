import { ReactNode, createContext, useState } from "react";

export const SharedContext = createContext({
  orderAmount: 0.00,
  setOrderAmount: (_value: number) => { }
})

export function SharedContextProvider({ children }: { children: ReactNode }) {
  const [orderAmount, setOrderAmount] = useState(0.00)

  return (
    <SharedContext.Provider
      value={{
        orderAmount,
        setOrderAmount
      }}
    >
      {children}
    </ SharedContext.Provider>
  )
}