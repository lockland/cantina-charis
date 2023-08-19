import { SimpleGrid } from "@mantine/core"
import SummaryCard from "./SummaryCard"
import { useState } from "react"
import { useFormContext } from "../hooks/formContext"

interface SummaryCardListProps {
  totalAmount: number,

  onChange?: any
}


function SummaryCardList({ totalAmount, onChange }: SummaryCardListProps) {
  const [changeOfMoney, setChangeOfMoney] = useState(0.00)
  const [paidAmount, setPaidAmount] = useState(0.00)

  const form = useFormContext()

  const handleOnChange = (value: number): void => {
    setPaidAmount(value)
  }

  const handleOnBlur = (): void => {
    const changeValue = paidAmount - totalAmount
    const hasPaid = changeValue >= 0

    setChangeOfMoney(changeValue)
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