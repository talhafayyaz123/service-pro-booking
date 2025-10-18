import { useEffect, useState } from 'react'

import { IPaymentElementProps, IPaymentElementsState } from '@/types/payment'

const paymentDefaultState: IPaymentElementsState = {
  cardNumberComplete: false,
  expiredComplete: false,
  cvcComplete: false,
  nameComplete: false,
  cardNumberError: null,
  expiredError: null,
  cvcError: null,
  addressComplete: false,
  firstName: '',
  lastName: '',
  phone: '',
}

export const paymentInutBaseStyles = {
  fontSize: '16px',
  fontWeight: '500',

  '::placeholder': {
    color: '#939DAA',
    fontFamily: 'sans-serif',
    fontWeight: 400,
    fontSize: '16px',
  },
}

export const paymentInputClasses =
  'bg-white text-16 font-normal leading-[22px]   border border-lightGray py-[14px] px-5 rounded-xl'

interface Props {
  withName?: boolean
}

export const usePaymentUtils = (props?: Props) => {
  const [paymentState, setPaymentState] =
    useState<IPaymentElementsState>(paymentDefaultState)

  const [error, setError] = useState('')
  const [name, setName] = useState('')
  const withName = props?.withName

  const resetPaymentComplete = () => {
    setPaymentState(paymentDefaultState)
  }

  const isDetailsCompleted =
    paymentState.cardNumberComplete &&
    paymentState.cvcComplete &&
    paymentState.expiredComplete &&
    (withName ? paymentState.nameComplete : true)

  const paymentError =
    !!paymentState.cardNumberError ||
    !!paymentState.cvcError ||
    !!paymentState.expiredError

  const onPaymentElementChange: IPaymentElementProps['onChange'] = ({
    element,
    evt,
    name,
  }) => {
    switch (element) {
      case 'number':
        setPaymentState((prevState) => ({
          ...prevState,
          cardNumberComplete: evt?.complete || false,
          cardNumberError: evt?.error?.message || null,
        }))
        break
      case 'expiration':
        setPaymentState((prevState) => ({
          ...prevState,
          expiredComplete: evt?.complete || false,
          expiredError: evt?.error?.message || null,
        }))
        break
      case 'cvc':
        setPaymentState((prevState) => ({
          ...prevState,
          cvcComplete: evt?.complete || false,
          cvcError: evt?.error?.message || null,
        }))
        break
      case 'name':
        if (props?.withName) {
          setName(name || '')
          setPaymentState((prevState) => ({
            ...prevState,
            nameComplete: !!name?.length,
          }))
        }
        break

      default:
        return
    }
    if (error) {
      setError('')
    }
  }

  useEffect(() => {
    return () => {
      setError('')
    }
  }, [])

  return {
    name,
    error,
    paymentError,
    paymentState,
    paymentInputClasses,
    isDetailsCompleted,
    setError,
    setPaymentState,
    onPaymentElementChange,
    resetPaymentComplete,
  }
}
