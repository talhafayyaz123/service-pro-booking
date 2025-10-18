import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { checkEmail } from '@/api/auth/checkEmail'
import {
  IconCalendar,
  IconChatBubble,
  IconLoader,
  IconLock,
} from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { FormPhoneDropdown } from '@/components/common/dropdown/phoneDropdown/FormPhoneDropdown'
import { FormInput } from '@/components/common/FormInput'
import { H16, H18, H48 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { defaultPhoneCode } from '@/core/consts/countries'
import { ROUTES } from '@/core/consts/routes'
import { cn } from '@/core/helpers/cn'
import { isValidEmail } from '@/core/helpers/formValidations'
import {
  loginSchema,
  registerSchema,
} from '@/core/validationSchemas/clientSignUpValidationSchema'
import OTPVerification from '@/features/booking/components/modals/register/OTPVerification'
import { BookingInfo } from '@/features/booking/requestBooking/BookingInfo'
import { ChooseService } from '@/features/booking/requestBooking/ChooseService'
import { useRegisterdUserV2 } from '@/features/booking/requestBooking/helpers'
import { bookingDataSelector } from '@/features/booking/store/bookingSelectors'
import {
  setBookingRegistrationStep,
  setIsConfirmDisabled,
  setIsSubmitting,
  setStep,
} from '@/features/booking/store/bookingStore'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
// import { useBookingSuccessModalOpen } from '@/features/modalsConfig/modals/BookingSuccessModal'
import { getRequestBody } from '@/features/signUp/helpers'
import { useSignUpStep } from '@/features/signUp/hooks/useSignUpStepper'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useDebounce } from '@/hooks/useDebounce'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { useYupValidationResolver } from '@/hooks/useYupResolver'
import { meSelector } from '@/store/me/meSelector'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

// import { createBnplBooking } from '../store/bookingRequests'

export const RequestABooking = () => {
  const { isSmall } = useMediaScreen()
  const { currentModal } = useAppSelector(modalsSelector)
  const { bookingRegistrationStep } = useAppSelector(bookingDataSelector)
  const isSignUpToConfirmBooking =
    currentModal === MODALS_TYPE.SIGN_UP_TO_CONFIRM && isSmall
  const isOtp = bookingRegistrationStep === 'otp'
  const dispatch = useAppDispatch()
  const dontChangeBookingStepOnPhotoUploading = useSignUpStep(
    (state) => state.dontChangeBookingStepOnPhotoUploading
  )
  const lastOpenedCustomFormId = useCustomFormStore(
    (state) => state.lastOpenedCustomFormId
  )
  // const openSuccessModal = useBookingSuccessModalOpen()

  const me = useAppSelector(meSelector)
  //const proId = useAppSelector((state) => state?.profile?.about?.data?.id)
  interface QueryParams {
    [key: string]: string | string[]
  }
  const parseQueryString = (): QueryParams => {
    const queryParams = new URLSearchParams(window.location.search)
    const queryObject: QueryParams = {}

    queryParams.forEach((value, key) => {
      if (queryObject[key]) {
        // If the key already exists, convert it to an array or append to the existing array
        queryObject[key] = Array.isArray(queryObject[key])
          ? [...(queryObject[key] as string[]), value]
          : [queryObject[key] as string, value]
      } else {
        queryObject[key] = value
      }
    })

    // Handle `selectedServices` specifically if it's a string and needs to be split into an array
    if (
      queryObject.selectedServices &&
      typeof queryObject.selectedServices === 'string'
    ) {
      queryObject.selectedServices = (
        queryObject.selectedServices as string
      ).split('%2C')
    }

    return queryObject
  }
  useEffect(() => {
    const booking = async () => {
      try {
        const queryData = parseQueryString()

        /*   if (queryData.selectedServices) {
          const servicesList = Array.isArray(queryData.selectedServices)
            ? queryData.selectedServices
            : [queryData.selectedServices]
         
        } */

        if (
          queryData.payment_intent &&
          queryData.payment_intent_client_secret &&
          queryData.redirect_status === 'succeeded'
        ) {
          dispatch(setStep(2))
          // openSuccessModal()
          /* await createBnplBooking({
            useWallet: queryData.useWallet === 'true',
            paymentMethod: 'KLARNA',
            paymentIntentId: queryData.payment_intent ?? '',
            services: servicesList,
            date: queryData.date,
            proId: proId,
            formAnswers: [],
          })
 */
        }
      } catch (error) {
        console.error('Error during booking creation:', error)
      }
    }

    booking()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (me && me.accountId && isSignUpToConfirmBooking) {
      if (!me.isVerified) {
        dispatch(setBookingRegistrationStep('otp'))
      } else {
        // if condition is true that means user is not authorized while making booking and he/she is uploading custom form image
        if (!dontChangeBookingStepOnPhotoUploading) {
          dispatch(setStep(2))
        } else {
          dispatch(
            setModal({
              currentModal: MODALS_TYPE.FORM_TEMPLATE_MODAL,
              state: { id: lastOpenedCustomFormId },
            })
          )
        }
      }
    }
  }, [
    isSignUpToConfirmBooking,
    me,
    dispatch,
    dontChangeBookingStepOnPhotoUploading,
    lastOpenedCustomFormId,
  ])

  return (
    <>
      <div
        className={clsx('w-full absolute top-0 left-0 bg-violet z-[0]', {
          'h-full': isOtp,
          'h-[414px]': !isOtp,
        })}
      />
      {isOtp ? (
        <div className="z-10 m-6">
          <OTPVerification />
        </div>
      ) : (
        <div className="!z-[10] overflow-y-auto w-full flex flex-col">
          <div
            className={clsx(
              'tablet:container mt-6 small:mb-2 tablet:mt-[80px] max-w-[1080px]',
              isSignUpToConfirmBooking && 'flex-1 flex flex-col'
            )}
          >
            <H48 className="!font-bold maxTablet:text-28 maxTablet:leading-[34px] maxTablet:mx-6">
              {isSignUpToConfirmBooking ? 'Add your info' : 'Request a booking'}
            </H48>
            <H18
              color="text-gray"
              className="mt-4 maxTablet:text-16 maxTablet:leading-[24px] maxTablet:mx-6"
            >
              {isSignUpToConfirmBooking
                ? 'Please, add your information to proceed to booking confirmation.'
                : `Select your preferred services, date, time and leave a comment (It's
            optional)`}
            </H18>
            <div
              className={clsx(
                'flex flex-col-reverse justify-center mt-6 laptop:grid laptop:grid-cols-2 tablet:gap-10 tablet:mt-10',
                isSignUpToConfirmBooking && 'h-full'
              )}
            >
              {isSignUpToConfirmBooking ? (
                <SignUpOrInForm />
              ) : (
                <>
                  <BookingInfo />
                  <ChooseService />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const SignUpOrInForm = () => {
  const dispatch = useAppDispatch()
  const [isRegistered, setIsRegistered] = useState(false)
  const { isSubmitting } = useAppSelector(bookingDataSelector)

  const form = useForm({
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
      phoneNumberCode: defaultPhoneCode,
    },
    resolver: useYupValidationResolver(
      isRegistered ? loginSchema : registerSchema
    ),
  })

  const email = form.watch('email')
  const debouncedEmail = useDebounce(email, 500)
  const _isValidEmail = isValidEmail(debouncedEmail)

  const { isFetching, isFetched } = useQuery({
    staleTime: 0,
    queryKey: ['checkEmail', debouncedEmail],
    queryFn: async () => {
      let result = false
      try {
        const response = await checkEmail({
          email: debouncedEmail,
        })
        result = response.isExist
      } catch (error: any) {
        result = error?.response?.data?.email === 'EMAIL_ALREADY_EXISTS'
      }

      setIsRegistered(result)

      return result
    },
    enabled: !!debouncedEmail && _isValidEmail,
  })
  const registerCallback = useRegisterdUserV2()
  const onSubmit = form.handleSubmit(
    async (data) => {
      try {
        if (isRegistered) {
          const result = await signIn('credentials', {
            password: data.password,
            email: data.email,
            role: 'CLIENT',
            redirect: false,
          })

          if (result?.error) {
            form.setError('email', {
              message: 'Email or password is incorrect',
            })
          }
        } else {
          const body = getRequestBody(data as any)
          await registerCallback({
            body,
            setStep: () => dispatch(setBookingRegistrationStep('otp')),
            setError: form.setError,
          })
        }
      } catch (e) {
        //
      } finally {
        dispatch(setIsSubmitting(false))
      }
    },
    () => {
      dispatch(setIsSubmitting(false))
    }
  )

  useEffect(() => {
    dispatch(setIsConfirmDisabled(!form.formState.isValid))
  }, [form.formState.isValid, dispatch])

  useEffect(() => {
    if (isSubmitting) {
      onSubmit()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitting])

  return (
    <FormProvider {...form}>
      <CardWrapper className="h-full pt-6 maxTablet:rounded-b-none maxTablet:shadow-none">
        <section className="w-full flex flex-col justify-start items-start gap-2.5">
          <span className="relative flex items-end justify-center w-full">
            <FormInput
              name="email"
              type="email"
              label="Email*"
              className="w-full"
              autoComplete="new-password"
              placeholder="Enter your email"
            />
            {isFetching && (
              <IconLoader
                className={cn('absolute right-5 animate-spin mb-3.5')}
              />
            )}
          </span>
        </section>
        {!isFetched || isFetching ? null : isRegistered ? (
          <BookingLoginForm />
        ) : (
          <BookingRegisterForm />
        )}
      </CardWrapper>
    </FormProvider>
  )
}

const BookingLoginForm = () => {
  return (
    <div className="mt-5">
      <H16 color="text-black" className="!font-bold">
        Log in to confirm your booking
      </H16>

      <FormInput
        name="password"
        type="password"
        label="Password*"
        className="w-full mt-4"
        autoComplete="new-password"
        placeholder="Enter your password"
      />
      <Link href={ROUTES.forgotPassword}>
        <a className="flex justify-end mt-3">
          <H16 color="text-gray">Forgot password?</H16>
        </a>
      </Link>
    </div>
  )
}

const BookingRegisterForm = () => {
  const proName = useAppSelector((state) => state.profile.iProInfo.data.name)

  return (
    <div className="flex flex-col mt-5 gap-y-4">
      <div className="flex flex-row w-full gap-4">
        <FormInput
          name="firstName"
          className="w-full"
          label="First name*"
          placeholder="first name"
          autoComplete="new-password"
        />
        <FormInput
          name="lastName"
          label="Last name*"
          className="w-full"
          placeholder="last name"
          autoComplete="new-password"
        />
      </div>
      <FormPhoneDropdown
        required
        label="Mobile number*"
        className="w-full !bottom-5"
      />
      <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-5 shadow-xl rounded-xl">
        <H16 className="!font-bold">Create an account</H16>
        <FormInput
          name="password"
          type="password"
          label="Password*"
          className="w-full"
          autoComplete="new-password"
          placeholder="Enter your password"
        />
        <div className="flex flex-col items-start justify-start w-full gap-4">
          {featureIcons.map((item, i) => (
            <section
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
                {item.title(proName)}
              </H16>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

const featureIcons = [
  {
    Icon: IconChatBubble,
    title: (name?: string) => (
      <>
        Chat with <span className="font-medium text-orange">{name}</span>{' '}
        directly from the Readyhubb app
      </>
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
