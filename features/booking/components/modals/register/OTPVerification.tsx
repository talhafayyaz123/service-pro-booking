// import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { checkVerificationCode } from '@/api/auth/checkVerificationCode'
import { sendPhoneVerification } from '@/api/auth/sendPhoneVerification'
import { Button } from '@/components/common/buttons/Button'
import { BaseLink } from '@/components/common/links/BaseLink'
import { Verify } from '@/components/common/VerifyCodeForm'
import { H16, H32 } from '@/components/typography'
import { MODALS_TYPE, OTP_TIMEFRAME } from '@/core/consts/common'
// import { MODALS_TYPE } from '@/core/consts/common'
// import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  setBookingRegistrationStep,
  setStep as setBookingStep,
} from '@/features/booking/store/bookingStore'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { openModal } from '@/features/modalsConfig/modalConfig'
import { useSignUpStep } from '@/features/signUp/hooks/useSignUpStepper'
import { useAppDispatch } from '@/hooks/hooks'
import { useOTPSeconds } from '@/hooks/useOTPSeconds'
import { setModal } from '@/store/modals/modalsSlice'
import { IAuthResponse } from '@/types/authTypes'

interface Props {
  getValues?: (v: string[]) => void
}

const OTPVerification: React.FC<Props> = ({ getValues }) => {
  const codeDefaultValue = useMemo(() => ['', '', '', ''], [])
  const methods = useForm<{ code: string[] }>({
    defaultValues: { code: codeDefaultValue },
  })
  const dispatch = useAppDispatch()
  const { handleSubmit, watch, setValue } = methods
  const { data, status } = useSession()
  const [isSending, setIsSending] = useState(true)
  const resendCount = useRef(-1)
  const { seconds, setSeconds, otpText } = useOTPSeconds()

  const { t: tCommon } = useTranslation(TRANSLATE_KEYS.common)

  const { setStep, dontChangeBookingStepOnPhotoUploading } = useSignUpStep(
    ({ setStep, dontChangeBookingStepOnPhotoUploading }) => ({
      setStep,
      dontChangeBookingStepOnPhotoUploading,
    })
  )
  const lastOpenedCustomFormId = useCustomFormStore(
    (state) => state.lastOpenedCustomFormId
  )
  const buttonRef = useRef<HTMLButtonElement | null | undefined>()
  const [error, setError] = useState('')
  const phoneNumber = data?.user.phone as string
  const phoneCode = data?.user.phoneCode as string
  const phoneWithCode = `${phoneCode} ${phoneNumber}`
  const isVerified = data?.user.isVerified

  const code = watch('code')

  const redirectUser = async () => {
    if (data?.user) {
      const cUser = data.user
      const user: IAuthResponse = {
        accessToken: { token: cUser.accessToken, expiresIn: '' },
        refreshToken: {
          token: cUser.refreshToken,
          expiresIn: '',
          id: cUser.refreshTokenId,
        },
        firstName: cUser.firstName,
        lastName: cUser.lastName,
        isVerified: true,
        name: cUser.name as string,
        role: cUser.role,
        phone: cUser.phone,
        email: cUser.email || '',
        phoneCode: cUser.phoneCode,
      }

      await signIn('credentials', {
        user: JSON.stringify(user),
        redirect: false,
      })

      // if condition is true that means user is not authorized while making booking and he/she is uploading custom form image
      if (!dontChangeBookingStepOnPhotoUploading) {
        dispatch(setBookingStep(2))
        dispatch(setModal({}))
      } else {
        dispatch(
          setModal({
            currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
            state: { id: lastOpenedCustomFormId },
          })
        )
      }

      dispatch(setBookingRegistrationStep('entering-data'))
    }
  }

  const sendVerificationCode = useCallback(async () => {
    resendCount.current = resendCount.current + 1

    if (resendCount.current > 2) {
      openModal({
        currentModal: 'OTPTroubleModal',
        modalSettings: {
          maxWidth: 463,
        },
      })
    }

    try {
      const lastSended = +(sessionStorage.getItem('otp_last_sended') || 0)
      const now = Date.now()
      const diff = Math.round((now - lastSended) / 1000)

      if (diff > OTP_TIMEFRAME) {
        setIsSending(true)
        await sendPhoneVerification({ phone: phoneNumber, phoneCode })
        setSeconds(OTP_TIMEFRAME)
        sessionStorage.setItem('otp_last_sended', now.toString())
      } else {
        setSeconds(OTP_TIMEFRAME - diff)
      }

      if (error) {
        setError('')
        setValue('code', codeDefaultValue)
      }
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong, can't send one time password."
      )
    } finally {
      setIsSending(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phoneNumber, error, setValue, codeDefaultValue, phoneCode])

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    if (isVerified) {
      redirectUser()
    } else if (phoneNumber && phoneCode) {
      sendVerificationCode()
    }
    //eslint-disable-next-line
  }, [status, phoneNumber])

  const onSubmit = handleSubmit(async ({ code }) => {
    try {
      const codes = code.join('')
      const res = await checkVerificationCode({
        token: codes,
        phone: phoneNumber,
        phoneCode,
      })
      if (res.result) {
        redirectUser()
        setStep(1)
      } else {
        setError('Code is invalid or expired.')
      }
    } catch (err) {
      setError('Code is invalid or expired.')
      return err
    }
  })

  useEffect(() => {
    // start count id resetCount is lower than 2
    if (resendCount.current > 2) {
      return
    }

    const timer =
      seconds && seconds > 0
        ? setInterval(async () => {
            setSeconds((prev) => (prev || 1) - 1)
          }, 1000)
        : undefined
    if (seconds === 0) {
      setError('')
      setValue('code', codeDefaultValue)
    }
    return () => {
      return clearInterval(timer)
    }
  }, [setValue, codeDefaultValue, seconds, setSeconds])

  return (
    <FormProvider {...methods}>
      <div className="bg-white small:p-8 p-4 flex flex-col max-w-[440px] text-center rounded-[20px]">
        <H32 className="!font-semibold">OTP Verification</H32>
        <H16 className="mt-2">
          <span className="text-gray">
            We have sent you one time password to
          </span>{' '}
          {phoneWithCode?.slice(0, phoneNumber?.length - 4) + '****'}
        </H16>
        {isSending ? (
          <H16 className="mt-4" color="text-gray">
            Sending one time password, please wait...
          </H16>
        ) : seconds !== null && resendCount.current <= 2 ? (
          <H16 color="text-orange" className="mt-4">
            {otpText}
          </H16>
        ) : null}

        <form onSubmit={onSubmit} className="flex flex-col mx-auto">
          <Verify
            error={error}
            setError={setError}
            getValues={getValues}
            length={4}
            buttonRef={buttonRef}
          />
          {seconds === 0 ? (
            <div className="flex items-center justify-center">
              <H16 color="text-gray" className="mr-1">
                Didn’t receive the OTP?
              </H16>
              <BaseLink
                type="button"
                onClick={sendVerificationCode}
                size="200"
                line={false}
                className="!font-normal"
              >
                Resend Code
              </BaseLink>
            </div>
          ) : null}
          <Button
            disabled={seconds === 0 || code.filter((s) => !!s).length != 4}
            type="submit"
            reff={buttonRef}
            size="200"
            buttonType="orange"
            className="mt-8"
          >
            {tCommon('buttons.verify')}
          </Button>
        </form>
      </div>
    </FormProvider>
  )
}

export default OTPVerification
