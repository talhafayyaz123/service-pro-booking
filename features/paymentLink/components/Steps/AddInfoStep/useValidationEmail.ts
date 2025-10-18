import { useState } from 'react'

import { isValidEmail } from '@/core/helpers/formValidations'
import { useLazyCheckEmailQuery } from '@/features/paymentLink/store/paymentLinkApi'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export const useValidationEmail = ({ setError }: { setError: any }) => {
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [checkEmail, checkEmailResponse] = useLazyCheckEmailQuery()
  const plStore = usePaymentLinkStore.getState()

  let isValidPhone = false
  const onValidateEmail = async (v: string) => {
    setIsLoadingEmail(true)
    const _isValidEmail = isValidEmail(v)
    if (!_isValidEmail) {
      setIsLoadingEmail(false)
      isValidPhone = false
    } else if (_isValidEmail) {
      const res = await checkEmail(v).then((v) => v)
      if (res.status === 'fulfilled') {
        plStore.setStore({
          isExistEmail: false,
        })
        isValidPhone = true
      } else {
        if ((res as any)?.error?.data?.email === 'EMAIL_ALREADY_EXISTS') {
          setIsLoadingEmail(false)
          plStore.setStore({
            isExistEmail: true,
          })
          isValidPhone = true
        } else {
          setIsLoadingEmail(false)
          setError('email', {
            message: 'Invalid email',
          })
          isValidPhone = false
        }
      }
      setIsLoadingEmail(false)
    } else {
      isValidPhone = true
      setIsLoadingEmail(false)
    }
    return await isValidPhone
  }

  return {
    onValidateEmail,
    isValidationEmail: isLoadingEmail || checkEmailResponse.isFetching,
  }
}
