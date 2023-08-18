import { SimpleGrid } from "@mantine/core"
import SummaryCard from "./SummaryCard"
import { useState } from "react"

function SummaryCardList(totalAmount: string) {
  const [changeOfMoney, setChangeOfMoney] = useState("0.00")
  const [paidAmount, setPaidAmount] = useState("0")

  const handleOnChange = (event: any) => {
    setPaidAmount(event.currentTarget.value)
  }

  const handleOnBlur = () => {
    const changeValue = (parseFloat(totalAmount) - parseFloat(paidAmount)).toFixed(2)
    setChangeOfMoney(changeValue)
  }

  return (
    <SimpleGrid cols={3}>
      <SummaryCard title="Total" readonly amount={totalAmount} />
      <SummaryCard
        title="Valor pago"
        placeholder="0"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />
      <SummaryCard title="Troco" readonly amount={changeOfMoney} />
    </SimpleGrid>

  )
}


export default SummaryCardList