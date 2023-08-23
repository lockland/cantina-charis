import SummaryCard from "./SummaryCard"
import { useState } from "react"
import { useFormContext } from "../hooks/formContext"
import { useSharedContext } from "../hooks/useSharedContext"
import CustomSimpleGrid from "./CustomSimpleGrid"

function SummaryCardList({ setButtonDisabled }: any) {
  const [changeOfMoney, setChangeOfMoney] = useState(0.00)
  const [paidAmount, setPaidAmount] = useState(0.00)

  const form = useFormContext()
  const { orderAmount, setOrderAmount } = useSharedContext()

  const handleOnChange = (value: number): void => {
    setPaidAmount(value)
  }

  const handleOnBlur = (): void => {
    const changeValue = paidAmount - orderAmount
    const hasPaid = changeValue >= 0
    setButtonDisabled(false)

    setChangeOfMoney(changeValue)
    form.setFieldValue("already_paid", hasPaid)
  }

  return (
    <CustomSimpleGrid mt="md" cols={3}>
      <SummaryCard
        title="Total"
        readonly
        amount={orderAmount}
        onChange={setOrderAmount}
      />
      <SummaryCard
        description="Caso não tenha sido pago, apenas digite 0 e depois tab"
        title="Valor pago"
        placeholder="0"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
      />
      <SummaryCard
        title="Troco"
        readonly
        amount={changeOfMoney}
      />
    </CustomSimpleGrid >

  )
}


export default SummaryCardList