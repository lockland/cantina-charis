import { SimpleGrid } from "@mantine/core"
import SummaryCard from "./SummaryCard"
import { useState } from "react"
import { useFormContext } from "../hooks/formContext"

interface SummaryCardListProps {
  totalAmount: string,

  onChange?: any
}


function SummaryCardList({ totalAmount, onChange }: SummaryCardListProps) {
  const [changeOfMoney, setChangeOfMoney] = useState("0.00")
  const [paidAmount, setPaidAmount] = useState("0")

  const form = useFormContext()

  const handleOnChange = (event: any) => {
    setPaidAmount(event.currentTarget.value)
  }

  const handleOnBlur = () => {
    const changeValue = parseFloat(paidAmount) - parseFloat(totalAmount)
    setChangeOfMoney(changeValue.toFixed(2))

    const hasPaid = changeValue >= 0

    form.setFieldValue("already_paid", hasPaid)
  }

  return (
    <SimpleGrid cols={3} mt="md">
      <SummaryCard title="Total" readonly amount={totalAmount} onChange={onChange} />
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