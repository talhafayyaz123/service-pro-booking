interface IProps {
  depositAmount: number
  totalPrice: number
  isCardPay: boolean
}

export const displayDepositAndWarning = ({
  depositAmount,
  totalPrice,
  isCardPay,
}: IProps) => {
  let displayDepositDueBoxAndWarning = false

  // show: if deposit exists and less than total
  if (depositAmount > 0 && depositAmount < totalPrice) {
    displayDepositDueBoxAndWarning = true
  }

  // no show: if deposit is zero
  if (depositAmount <= 0) {
    displayDepositDueBoxAndWarning = false
  }

  // no show: deposit is more than 0 and is equal to total or more than total
  if (depositAmount > 0 && depositAmount >= totalPrice) {
    displayDepositDueBoxAndWarning = false
  }

  // show: for only card payments
  if (!isCardPay) {
    displayDepositDueBoxAndWarning = false
  }

  return displayDepositDueBoxAndWarning
}
