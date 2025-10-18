import { useMemo, useRef } from 'react'

import { MODALS_TYPE } from '@/core/consts/common'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { openModal } from '@/features/modalsConfig/modalConfig'
import {
  useLazyExternalAuthQuery,
  useLazySendVerificationQuery,
  useLazySendVerifyCodeQuery,
} from '@/features/paymentLink/store/paymentLinkApi'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useAppDispatch } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { setModal } from '@/store/modals/modalsSlice'

export const useOTPVerifyInfo = () => {
  const resendCount = useRef(0)
  const dispatch = useAppDispatch()
  const [sendVerifyCode, verifyCodeResponse] = useLazySendVerifyCodeQuery()
  const [sendVerification, verificationResponse] =
    useLazySendVerificationQuery()
  const [, externalAuthResponse] = useLazyExternalAuthQuery()
  const setStore = usePaymentLinkStore.getState().setStore
  const { changeStep, isInfoPhotoUpload, setIsInfoPhotoUpload } =
    useDepositRequestedBookingStore()

  const { phoneNumber, code } = usePaymentLinkStore((state) => state)

  const { isSmall, isTablet, isLaptop } = useMediaScreen()
  const isDesktop = !isSmall && !isTablet && !isLaptop

  const errorMessage = useMemo(() => {
    const errorCode =
      errorCodes?.[(verificationResponse?.error as any)?.data?.message] ||
      errorCodes?.[(verifyCodeResponse?.error as any)?.data?.message]

    if (errorCode) {
      return errorCode
    } else if (
      verificationResponse.status === 'rejected' ||
      verifyCodeResponse.status === 'rejected'
    ) {
      return 'Server error'
    } else {
      return ''
    }
  }, [
    verificationResponse?.error,
    verificationResponse.status,
    verifyCodeResponse?.error,
    verifyCodeResponse.status,
  ])

  const onBack = () => {
    setStore({ step: [1, 2] })
    changeStep('auth')
  }

  const handleVerify = async (verifyCode: string) => {
    const lastOpenedCustomFormId =
      useCustomFormStore.getState().lastOpenedCustomFormId

    const response = await sendVerifyCode({
      phone: phoneNumber ?? '',
      phoneCode: '+' + String((code ?? '').split('+')[1]),
      token: verifyCode,
    }).unwrap()
    if (response.result) {
      if (isInfoPhotoUpload) {
        setIsInfoPhotoUpload(false)
        dispatch(
          setModal({
            currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
            state: { id: lastOpenedCustomFormId },
          })
        )

        if (!isDesktop) {
          setStore({ step: [1, 1] })
        }
      } else {
        setStore({ step: [2, 1] })
        dispatch(
          setModal({
            currentModal: undefined,
          })
        )
      }
      changeStep('payment')
    }
  }

  const handleRequestVerifyCode = () => {
    resendCount.current = resendCount.current + 1

    if (resendCount.current > 2) {
      openModal({
        currentModal: 'OTPTroubleModal',
        modalSettings: {
          maxWidth: 463,
        },
      })
    }

    sendVerification({
      phone: externalAuthResponse.data?.phone ?? '',
      phoneCode: externalAuthResponse.data?.phoneCode ?? '',
    })
  }
  const phoneCode = '+' + (code ?? '').split('+')[1]
  const reducedPhoneNumber = (phoneNumber ?? '').slice(0, 3)
  const phoneSecret = `${phoneCode} ${reducedPhoneNumber} ` + '****'

  const isLoading =
    verifyCodeResponse.isFetching || verificationResponse.isLoading

  return {
    onBack,
    handleVerify,
    handleRequestVerifyCode,
    errorMessage,
    phoneSecret,
    isLoading,
    resendCount,
  }
}

export const errorCodes: Record<string, string> = {
  SMS_LIMIT_EXCEEDED: 'Sms limit exceeded',
  INCORRECT_VERIFICATION_CODE: 'Incorrect verification code',
}
