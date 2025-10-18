import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useCallback, useEffect, useState } from 'react'
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { useDebounce } from 'use-debounce'
import { InferType } from 'yup'

import { checkEmail } from '@/api/auth/checkEmail'
import { IconLoader } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { CloseButton } from '@/components/common/buttons/CloseButton'
import { FormInput } from '@/components/common/FormInput'
import { Modal } from '@/components/modals/Modal'
import { H14, H16, H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { defaultPhoneCode } from '@/core/consts/countries'
import { ROUTES } from '@/core/consts/routes'
import { checkSingleDomainEmail } from '@/core/helpers/check-domain-email'
import { cn } from '@/core/helpers/cn'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { handleSignOut } from '@/core/helpers/handleSignOut'
import {
  loginSchema,
  registerSchema,
} from '@/core/validationSchemas/clientSignUpValidationSchema'
import { useRegisterdUserV2 } from '@/features/booking/requestBooking/helpers'
import { setStep } from '@/features/booking/store/bookingStore'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { getRequestBody } from '@/features/signUp/helpers'
import { useSignUpStep } from '@/features/signUp/hooks/useSignUpStepper'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { useYupValidationResolver } from '@/hooks/useYupResolver'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

import { BookingLoginForm } from './LoginForm'
import OTPVerification from './OTPVerification'
import { BookingRegister } from './RegisterForm'

type TLoginSchema = InferType<typeof loginSchema>
type TRegisterSchema = InferType<typeof registerSchema>
export type TSchema = TLoginSchema | TRegisterSchema

export const SignUpToConfirmBooking = () => {
  const { data: sessionData } = useSession()
  const dispatch = useAppDispatch()
  const { currentModal, state } = useAppSelector(modalsSelector)
  const [error, setError] = useState<'EMAIL_ALREADY_EXISTS' | 'INVALID_EMAIL'>()
  const [submitErr, setSubError] = useState<string>('')
  const [regstep, setregstep] = useState<number>(1)
  const [loading, setLoading] = useState<boolean>(false)
  const [regloading, setRegLoading] = useState<boolean>(false)

  const { step, dontChangeBookingStepOnPhotoUploading } = useSignUpStep(
    ({ step, dontChangeBookingStepOnPhotoUploading }) => ({
      step,
      dontChangeBookingStepOnPhotoUploading,
    })
  )
  const lastOpenedCustomFormId = useCustomFormStore(
    (state) => state.lastOpenedCustomFormId
  )

  const resolver = useYupValidationResolver<TRegisterSchema>(
    !error ? registerSchema : loginSchema
  )
  const methods = useForm<TRegisterSchema>({
    resolver,
    mode: 'all',
    defaultValues: {
      phoneNumberCode: defaultPhoneCode,
    },
  })
  const {
    watch,
    formState: { errors },
    setError: setFormError,
  } = methods

  const email = watch('email')
  const [debouncedEmail] = useDebounce(email, 300)
  const [debouncedLoading] = useDebounce(!loading, 300)

  const { isSmall, isTablet } = useMediaScreen()

  const open =
    isSmall || isTablet
      ? false
      : currentModal === MODALS_TYPE.SIGN_UP_TO_CONFIRM

  const onClose = useCallback(async () => {
    dispatch(setModal({}))
    methods.reset({
      phoneNumberCode: defaultPhoneCode,
    })
    methods.clearErrors()
    setError(undefined)
    setSubError('')

    setregstep(1)

    // if user is signed in and is not verified, when close modal don't do sign out, set regstep = 1
    if (sessionData && sessionData.user) {
      return
    }

    if (!error && step) {
      await signOut({ redirect: false })

      // helper function that consists of all functions that are should be called while signing out
      handleSignOut()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  const registerV2 = useRegisterdUserV2()

  const onSubmit = async (data: TSchema) => {
    try {
      if (error) {
        await signIn('credentials', {
          password: data.password,
          email: data.email,
          role: 'CLIENT',
          redirect: false,
        }).then((res) => {
          const wrong = 'WRONG_PASSWORD'
          if (res?.error?.includes(wrong)) {
            setFormError('password', {
              type: 'manual',
              message: 'Wrong password',
            })
            return
          }
          // if condition is true that means user is not authorized while making booking and he/she is uploading custom form image
          if (!dontChangeBookingStepOnPhotoUploading) {
            dispatch(setStep(2))
            dispatch(setModal({}))
          } else {
            dispatch(
              setModal({
                currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
                state: { id: lastOpenedCustomFormId },
              })
            )
          }
        })
      } else {
        setRegLoading(true)
        const body = await getRequestBody(data as any)
        await registerV2({
          body,
          setStep: () => setregstep(3),
          setError: methods.setError,
        })

        setRegLoading(false)
      }
    } catch (err) {
      setRegLoading(false)
      console.error('err', err)
    }
  }

  useEffect(() => {
    if (!errors.email?.message) {
      if (checkSingleDomainEmail(email || '')) {
        setFormError('email', {
          type: 'manual',
          message: 'Please enter a valid email address',
        })
        return
      }
      const login = async () => {
        try {
          if (!email) return
          setLoading(true)
          await checkEmail({
            email,
          })
          setError(undefined)
          setLoading(false)
        } catch (err) {
          const error = err as {
            response: {
              data: { email: 'EMAIL_ALREADY_EXISTS' | 'INVALID_EMAIL' }
            }
          }
          if (error?.response?.data?.email === 'INVALID_EMAIL') {
            setLoading(false)
            return
          }
          setError(error?.response?.data?.email)
          setLoading(false)
        }
      }
      login()
    } else {
      setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedEmail, email, errors.email?.message])

  useEffect(() => {
    const length = email?.split(' ').length
    if (length > 1) {
      methods.setError('email', {
        type: 'manual',
        message: 'Please enter a valid email address',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  // render OTP if client is signed in and not verified
  useEffect(() => {
    if (
      regstep !== 3 &&
      sessionData &&
      sessionData.user &&
      !sessionData.user.isVerified
    ) {
      setregstep(3)
    }
  }, [sessionData, regstep])

  const password = methods.watch('password')

  const content = (
    <div className="flex flex-col w-full h-max">
      <div className="flex flex-col items-start justify-start w-full gap-5 h-max">
        <section className="w-full flex flex-col justify-start items-start gap-2.5">
          <span className="relative flex items-end justify-center w-full">
            <FormInput
              name="email"
              placeholder="Enter your email"
              label="Email*"
              autoComplete="new-password"
              type="email"
              className="w-full"
            />

            {loading && !errors.email?.message && (
              <IconLoader
                className={cn('absolute right-5 animate-spin mb-3.5')}
              />
            )}
          </span>
        </section>
        {!errors.email?.message &&
          debouncedLoading &&
          debouncedEmail &&
          (error ? <BookingLoginForm /> : <BookingRegister />)}
      </div>
    </div>
  )

  const disabled = error
    ? !!errors?.email || !!errors?.password
    : !!errors?.email ||
      !!errors?.password ||
      !!errors?.firstName ||
      !!errors?.lastName ||
      !!errors?.phoneNumber ||
      regloading

  return (
    <>
      <Modal
        isOpen={open}
        maxWidth={463}
        onClose={onClose}
        outsideClose={false}
        onCloseButton={false}
        space="overflow-hidden"
      >
        <OTPWrapper
          step={state && state.registerStep ? state.registerStep : regstep}
        >
          <FormWrapper methods={methods} onSubmit={onSubmit}>
            <div className={'flex justify-end px-8 mt-8'}>
              <CloseButton onClick={onClose} />
            </div>
            <div className="text-center pb-10 px-[32px] pt-4 w-full h-full overflow-y-auto">
              {header}
              {content}
            </div>
            <section className="bottom-0 z-20 w-full px-8 py-6 bg-white border-t border-lightGray">
              {submitErr && (
                <H16
                  color="text-orange"
                  className="w-full text-center text-wrap"
                >
                  {submitErr}
                </H16>
              )}
              <SubmitButton disabled={disabled}>
                Proceed to confirmation
              </SubmitButton>
              {password && (
                <H14 color="text-black" className={' mt-4 block'}>
                  By clicking the Create account button, you are confirming that
                  you have read and agreed to our{' '}
                  <Link href={ROUTES.privacyPolicy}>
                    <a target="_blank">
                      <span
                        role="button"
                        className="!font-normal text-orange transition hover:text-orange1"
                      >
                        Privacy Policy
                      </span>
                    </a>
                  </Link>{' '}
                  and{' '}
                  <Link
                    href={getUrlWithSearchParams(ROUTES.termsAndConditions, {
                      forRole: 'PRO',
                    })}
                  >
                    <a target="_blank">
                      <span
                        role="button"
                        className="!font-normal text-orange transition hover:text-orange1"
                      >
                        Terms of service
                      </span>
                    </a>
                  </Link>
                </H14>
              )}
            </section>
          </FormWrapper>
        </OTPWrapper>
      </Modal>
    </>
  )
}

const header = (
  <section className="flex flex-col justify-center w-full gap-4 text-center maxTablet:justify-start maxTablet:text-left tablet:items-center maxTablet:mb-6 maxTablet:px-1">
    <H28>Add your info</H28>
    <H16 color="text-gray">
      Please, add your information to proceed to booking confirmation.
    </H16>
  </section>
)

type TFormProps<T extends FieldValues> = {
  children: React.ReactNode
  methods: UseFormReturn<T>
  onSubmit: (data: T) => void
}

const FormWrapper = <T extends FieldValues>({
  children,
  methods,
  onSubmit,
}: TFormProps<T>) => {
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col box-border max-h-[98dvh] overflow-auto"
      >
        {children}
      </form>
    </FormProvider>
  )
}

const OTPWrapper = ({
  children,
  step,
}: {
  children: React.ReactNode
  step: number
}) => {
  if (step === 3) return <OTPVerification />
  return <>{children}</>
}

const SubmitButton = ({
  children,
  disabled,
}: {
  children: React.ReactNode
  disabled: boolean
}) => {
  return (
    <Button
      type="submit"
      className="w-full"
      buttonType="orange"
      disabled={disabled}
    >
      {children}
    </Button>
  )
}
