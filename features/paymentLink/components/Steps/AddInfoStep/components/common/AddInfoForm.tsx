import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { IconCalendar, IconChatBubble, IconLock } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { FormPhoneDropdownV2 } from '@/components/common/dropdown/phoneDropdown/FormPhoneDropdownV2'
import { FormInput } from '@/components/common/FormInput'
import { SwitcherXl } from '@/components/common/Switcher'
import { ErrorMessage, H16 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import {
  isValidEmail,
  passwordValidation,
} from '@/core/helpers/formValidations'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { TermsAntPolicy } from '@/features/paymentLink/components/Steps/AddInfoStep/components/common/TermsAntPolicy'
import { useValidationPhoneNumber } from '@/features/paymentLink/components/Steps/AddInfoStep/usePhoneNumberEffects'
import { useValidationEmail } from '@/features/paymentLink/components/Steps/AddInfoStep/useValidationEmail'
import { setCookiePLAuthInfo } from '@/features/paymentLink/constants'
import {
  useGetInfoByExternalLinkQuery,
  useLazyExternalAuthQuery,
  useLazySendVerificationQuery,
} from '@/features/paymentLink/store/paymentLinkApi'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { IExternalAuthParams } from '@/features/paymentLink/store/types'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

interface IFirstStepForm {
  email?: string
  phoneNumber?: string
  code?: any
}

const FirstStep = () => {
  const defaultValues = usePaymentLinkStore((state) => ({
    phoneNumber: state.phoneNumber,
    email: state.email,
    code: state.code,
  }))
  const methods = useForm<IFirstStepForm>({
    defaultValues: defaultValues as IFirstStepForm,
    mode: 'onSubmit',
  })

  const setError = methods.setError
  const clearErrors = methods.clearErrors

  const { onValidateEmail, isValidationEmail } = useValidationEmail({
    setError,
  })

  const {
    isValidatingPhoneNumber,
    onValidatePhoneNumber,
    onValidPhoneNumberEffect,
  } = useValidationPhoneNumber({ setError })

  const onSubmit = async (data: IFirstStepForm) => {
    const setStore = usePaymentLinkStore.getState().setStore
    const isValidEmail = await onValidateEmail(data.email ?? '')
    const isValidPhone = await onValidatePhoneNumber(
      data.phoneNumber,
      data.code
    )

    if (isValidEmail) {
      clearErrors('email')
    } else {
      setError('email', { message: 'Invalid email' })
    }
    if (isValidPhone) {
      clearErrors('phoneNumber')
    } else {
      setError('phoneNumber', { message: 'Please enter a valid phone number' })
    }

    if (isValidEmail && isValidPhone) {
      setStore({
        email: data.email,
        code: data.code,
        phoneNumber: data.phoneNumber,
        addInfoFormStep: 2,
      })
    }
  }

  useEffect(() => {
    if (methods.formState.isSubmitted) {
      onValidPhoneNumberEffect({
        setError,
        clearErrors,
        getValues: methods.getValues,
      })
    }
    //eslint-disable-next-line
  }, [methods.formState.isSubmitted])

  return (
    <FormProvider {...methods}>
      <form id="ADD_INFO_FORM" onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={'px-3 laptop:px-8 pb-8 mt-5'}>
          <FormPhoneDropdownV2
            label="Mobile number*"
            isLoading={isValidatingPhoneNumber}
            sideEffect={
              methods.formState.isSubmitted
                ? async () =>
                    await onValidPhoneNumberEffect({
                      setError,
                      clearErrors,
                      getValues: methods.getValues,
                    })
                : undefined
            }
          />

          <FormInput
            rules={{
              validate: (v) => {
                const _isValidEmail = isValidEmail(v)

                if (_isValidEmail) {
                  return true
                } else {
                  return 'Must be a valid email'
                }
              },
            }}
            id="email_input"
            name="email"
            placeholder="Enter your email"
            label="Email*"
            autoComplete="off"
            className="w-full mt-5"
            isLoading={isValidationEmail}
          />
        </div>
        <div
          className={
            'pt-4 border-t border-lightGray  mb-4 px-3 laptop:px-8 maxLaptop:hidden'
          }
        >
          <Button className={'w-full'} buttonType="orange" type="submit">
            Continue
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}

const SecondStep = () => {
  const store = usePaymentLinkStore((state) => state)

  const methods = useForm({
    defaultValues: {
      isCreateAccount: !store.isExistEmail && !store.isExistPhone,
      lastName: store.lastName,
      firstName: store.firstName,
    },
  })
  const [externalAuth, externalAuthResponse] = useLazyExternalAuthQuery()
  const [sendVerification, sendVerificationResponse] =
    useLazySendVerificationQuery()

  const [errorVerifyMessage, setErrorVerifyMessage] = useState('')
  const dispatch = useAppDispatch()

  const onSubmit = async (data: any) => {
    const store = usePaymentLinkStore.getState()
    const setState = usePaymentLinkStore.getState().setStore
    const setBookingStep = useDepositRequestedBookingStore.getState().changeStep
    const isInfoPhotoUpload =
      useDepositRequestedBookingStore.getState().isInfoPhotoUpload
    const setIsInfoPhotoUpload =
      useDepositRequestedBookingStore.getState().setIsInfoPhotoUpload
    const lastOpenedCustomFormId =
      useCustomFormStore.getState().lastOpenedCustomFormId
    const newTimestemp = new Date().getTime()
    const lastTimestemp = usePaymentLinkStore.getState().verifyTimestemp

    const externalAuthPayload: IExternalAuthParams = {
      email: store.email ?? '',
      phoneCode: String('+' + store.code?.split('+')[1]) ?? '',
      firstName: data.firstName ?? '',
      lastName: data.lastName ?? '',
      phone: store.phoneNumber ?? '',
      password: data?.password ?? '',
      createAccount: data.isCreateAccount,
    }
    if (data?.isCreateAccount) {
      if (newTimestemp - (lastTimestemp ?? 0) < 60 * 1000) {
        setErrorVerifyMessage(
          'The code has already been sent, try again in a minute'
        )

        return
      }
    }

    try {
      const response = await externalAuth(externalAuthPayload).unwrap()
      setCookiePLAuthInfo({
        ...response,
        email: externalAuthPayload.email,
      })

      if (data?.isCreateAccount) {
        const verifyResponse = await sendVerification({
          phone: externalAuthPayload.phone,
          phoneCode: externalAuthPayload.phoneCode,
        }).unwrap()
        const _verifyTimestemp = new Date().getTime()
        setState({ verifyTimestemp: _verifyTimestemp })

        if (typeof verifyResponse?.result === 'boolean') {
          setBookingStep('otp')

          setState({ ...data, step: [1, 3] })
        }
      } else {
        if (isInfoPhotoUpload) {
          setBookingStep('payment')
          dispatch(
            setModal({
              currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
              state: { id: lastOpenedCustomFormId },
            })
          )
          setIsInfoPhotoUpload(false)
        } else {
          setState({ ...data, step: [2, 1] })
          dispatch(
            setModal({
              currentModal: undefined,
            })
          )
        }
      }
    } catch (e: any) {
      //
    }
  }

  const router = useRouter()
  const id = router.query.bookingId as string
  const { data } = useGetInfoByExternalLinkQuery(id)

  const isExistUse = store.isExistEmail || store.isExistPhone

  const isCreateAccount = methods.watch('isCreateAccount')

  const isValidatePassword = !isCreateAccount && isExistUse

  useEffect(() => {
    if (isExistUse) {
      methods.setValue('isCreateAccount', false)
    }
    //eslint-disable-next-line
  }, [isExistUse])

  return (
    <FormProvider {...methods}>
      <form id="ADD_INFO_FORM" onSubmit={methods.handleSubmit(onSubmit)}>
        <div
          data-testid="addInfo-name-inputs"
          className={cn('flex flex-row w-full gap-4 mt-5 px-3 laptop:px-8')}
        >
          <FormInput
            rules={{
              required: {
                value: true,
                message: 'Please add first name',
              },
            }}
            name="firstName"
            placeholder="First name"
            label="First name*"
            autoComplete="new-password"
            type="text"
            className="w-full"
          />
          <FormInput
            rules={{
              required: {
                value: true,
                message: 'Please add the last name',
              },
            }}
            name="lastName"
            placeholder="Last name"
            label="Last name*"
            autoComplete="new-password"
            type="text"
            className={cn('w-full')}
          />
        </div>
        {errorVerifyMessage && (
          <ErrorMessage
            className={'px-3 laptop:px-8 text-[16px] text-start mt-3 block'}
          >
            {errorVerifyMessage}
          </ErrorMessage>
        )}
        {!isExistUse && (
          <article
            data-testid={'addInfo-createAccount-checkbox'}
            className="flex items-center justify-between px-3 my-5 laptop:px-8"
          >
            <H16 className={'!font-extrabold'}>Create an account</H16>
            <Controller
              name={'isCreateAccount'}
              render={({ field }) => (
                <SwitcherXl
                  setChecked={(e) => {
                    store.setStore({ isCreateAccount: e })
                    field.onChange(e)
                  }}
                  checked={field.value}
                />
              )}
            />
          </article>
        )}
        {isCreateAccount && !isExistUse && (
          <div className={'px-3 laptop:px-8'}>
            <article
              data-testid={'addInfo-password-block'}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full gap-6 p-5 shadow-xl rounded-xl'
              )}
            >
              <H16 className="!font-bold">Create an account</H16>
              <FormInput
                name="password"
                placeholder="Create your password"
                label="Password*"
                autoComplete="new-password"
                type="password"
                className="w-full"
                rules={{
                  required: {
                    value: isValidatePassword,
                    message: 'This field is required',
                  },
                  minLength: {
                    value: 8,
                    message:
                      'Password must contain an uppercase letter, a symbol, a number and must be at least 8 letters long',
                  },
                  validate: (v) => {
                    const isValid = passwordValidation(v)
                    if (isValid) {
                      return true
                    } else {
                      return 'Password must contain an uppercase letter, a symbol, a number and must be at least 8 letters long'
                    }
                  },
                }}
              />
              <div className="flex flex-col items-start justify-start w-full gap-4">
                {featureIcons.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-row items-center justify-start w-full gap-4"
                  >
                    <span
                      className={cn(
                        'shadow-xl p-[11px] rounded-full border-2 border-white',
                        item.class
                      )}
                    >
                      <item.Icon className="w-5 h-5" />
                    </span>
                    <H16 className="w-full text-left text-wrap">
                      {item.title(
                        <span className="inline text-orange">
                          {data?.proName}
                        </span>
                      )}
                    </H16>
                  </div>
                ))}
              </div>
            </article>
          </div>
        )}
        <div
          className={
            'pt-4 border-t border-lightGray mb-4 px-8 mt-8 maxLaptop:hidden'
          }
        >
          <Button
            isLoading={
              externalAuthResponse.isFetching ||
              sendVerificationResponse.isFetching
            }
            className={'w-full'}
            buttonType="orange"
            type="submit"
          >
            Proceed to confirmation
          </Button>
        </div>
        <Button
          onClick={() =>
            usePaymentLinkStore.getState().setStore({ addInfoFormStep: 1 })
          }
          disabled={
            externalAuthResponse.isFetching ||
            sendVerificationResponse.isFetching
          }
          className={'w-full mb-5 mt-5 maxLaptop:hidden'}
          buttonType="link"
          type="button"
        >
          Back
        </Button>
        <div className={'px-8 maxLaptop:hidden'}>
          <TermsAntPolicy buttonText={'Proceed to confirmation'} />
        </div>
      </form>
    </FormProvider>
  )
}

const featureIcons = [
  {
    Icon: IconChatBubble,
    title: (name?: ReactNode) => (
      <>Chat with {name} directly from the Readyhubb app</>
    ),
    class: 'bg-[#B6BECE4D] drop-shadow-xl',
  },
  {
    Icon: IconCalendar,
    title: () =>
      `Manage your bookings and stay updated with the latest promotions`,
    class: 'bg-lightMain',
  },
  {
    Icon: IconLock,
    title: () => `Make secure payments`,
    class: 'bg-[#F5D4A4]',
  },
]

export const AddInfoForm = () => {
  const addInfoFormStep = usePaymentLinkStore((state) => state.addInfoFormStep)
  return (
    <div>
      {addInfoFormStep === 1 && <FirstStep />}
      {addInfoFormStep === 2 && <SecondStep />}
    </div>
  )
}
