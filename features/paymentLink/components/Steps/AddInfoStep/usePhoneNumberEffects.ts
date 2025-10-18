import { isValidPhoneNumber } from 'libphonenumber-js'
import { useState } from 'react'

import { useCheckPhoneNumberMutation } from '@/features/paymentLink/store/paymentLinkApi'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export const useValidationPhoneNumber = ({ setError }: { setError: any }) => {
  const [isLoading, setIsLoading] = useState(false)

  const [checkPhoneNumber, checkPhoneNumberResponse] =
    useCheckPhoneNumberMutation()

  const setStore = usePaymentLinkStore.getState().setStore

  const onValidPhoneNumberEffect = async ({
    setError,
    clearErrors,
    getValues,
  }: {
    setError: any
    clearErrors: any
    getValues: any
  }) => {
    const phoneNumber = getValues('phoneNumber')
    const code = getValues('code')
    const isValidPhone = isValidPhoneNumber(
      phoneNumber ?? '',
      code?.split('+')?.[0] as any
    )

    if (isValidPhone) {
      clearErrors('phoneNumber')
    } else {
      setError('phoneNumber', { message: 'Please enter a valid phone number' })
    }
    setIsLoading(false)
  }

  const onValidatePhoneNumber = async (phoneNumber: any, code: any) => {
    let isValidPhone = isValidPhoneNumber(
      phoneNumber ?? '',
      code?.split('+')?.[0] as any
    )
    if (!isValidPhone) {
      return false
    }

    setIsLoading(true)
    const { data } = (await checkPhoneNumber({
      phoneCode: code?.split('+')?.[1] ? `+${code?.split('+')?.[1]}` : '',
      phone: phoneNumber ?? '',
    })) as { data: { isExist: boolean } }

    if (typeof data?.isExist !== 'boolean') {
      setError('phoneNumber', {
        message: 'Server error',
      })
    } else if (data?.isExist) {
      setStore({
        isExistPhone: true,
      })
      isValidPhone = true
    } else if (!data?.isExist) {
      isValidPhone = true
      setStore({
        isExistPhone: false,
      })
    }
    setIsLoading(false)
    return isValidPhone
  }
  //
  return {
    onValidatePhoneNumber,
    onValidPhoneNumberEffect,
    isValidatingPhoneNumber: isLoading || checkPhoneNumberResponse.isLoading,
  }
}
