import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'

import { BackButton } from '@/components/common/buttons/BackButton'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { SpinnerFullScreen } from '@/components/Loaders'
import { MainSidebarMenu } from '@/components/sidebarMenu/MainSidebarMenu'
import { MODALS_TYPE } from '@/core/consts/common'
import { BookingFooter } from '@/features/booking/BookingFooter'
import { BookingLoaderScreen } from '@/features/booking/components/BookingLoaderScreen'
import { ConfirmBooking } from '@/features/booking/confirmBooking/ConfirmBooking'
import { useBNPLCheckout } from '@/features/booking/hooks/useBNPLCheckout'
import { RequestABooking } from '@/features/booking/requestBooking/RequestABooking'
import { getChooseServiceForBooking } from '@/features/booking/store/bookingRequests'
import { bookingDataSelector } from '@/features/booking/store/bookingSelectors'
import {
  clearBookingData,
  selectAddon,
  setBookingData,
  setBookingRegistrationStep,
  setIsSubmitting,
  setStep,
  TSteps,
} from '@/features/booking/store/bookingStore'
import {
  getProfileAboutProThunk,
  getTermsOfPaymentByIdThunk,
} from '@/features/profile/store/profileRequests'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { RootStateType } from '@/store/rootStore'

export const BookingContent = () => {
  const dispatch = useAppDispatch()

  const { currentStep, onBack } = useBookingConfig()
  const router = useRouter()
  const { data, status } = useSession()

  const params = router.query
  const proId = params?.proId as string

  const addons = params?.addons as string

  useEffect(() => {
    if (proId) {
      dispatch(getProfileAboutProThunk(proId))
      dispatch(getTermsOfPaymentByIdThunk(proId))
    }
  }, [dispatch, proId, status])

  useEffect(() => {
    const selectedServices = router.query.selectedServices as string | undefined
    const _selectedServicesArr = (selectedServices || '').split(',')
    if (proId) {
      dispatch(
        getChooseServiceForBooking({
          proId: proId,
          servicesId: _selectedServicesArr,
        })
      )
    } else {
      router.back()
    }
    //eslint-disable-next-line
  }, [dispatch, status])

  useEffect(() => {
    if (addons) {
      const addonsArr = addons?.split(',')
      addonsArr?.forEach((id) => {
        dispatch(selectAddon(id))
      })
    }
    //eslint-disable-next-line
  }, [addons])

  useEffect(() => {
    return () => {
      dispatch(clearBookingData())
    }
  }, [dispatch])

  const isBNPLLoading = useBNPLCheckout()

  return (
    <div id="app_layout" className="flex flex-col">
      <header className="px-5 tablet:px-20 flex justify-between items-center shadow-xl h-[72px] small:h-[82px]">
        <div>
          <BackButton className="tablet:hidden" onBack={onBack} />
          <Button
            size="42"
            className="!px-3 !border !border-lightGray maxTablet:hidden"
            buttonType="withIcon"
            onClick={onBack}
          >
            Back
          </Button>
        </div>
        <LogoButton className="mr-[13px]" />
        {data?.user ? <MainSidebarMenu /> : <div />}
      </header>
      <section className="relative flex flex-1 overflow-y-auto">
        {currentStep}
      </section>
      {isBNPLLoading && <SpinnerFullScreen className={'bg-lightGray/50'} />}
      <BookingFooter />
      <BookingLoaderScreen />
    </div>
  )
}

const useBookingConfig = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const step = useAppSelector((state: RootStateType) => state.booking.step)
  const { isSmall } = useMediaScreen()
  const { currentModal } = useAppSelector(modalsSelector)
  const { bookingRegistrationStep } = useAppSelector(bookingDataSelector)
  const isSignUpToConfirmBooking =
    currentModal === MODALS_TYPE.SIGN_UP_TO_CONFIRM && isSmall
  const isOtp = bookingRegistrationStep === 'otp'

  useEffect(() => {
    return () => {
      dispatch(setBookingData({ date: null }))
    }
  }, [dispatch])

  const handleSetStep = useCallback(
    (step: TSteps) => {
      dispatch(setStep(step))
    },
    [dispatch]
  )
  const steps: Record<TSteps, ReactNode> = useMemo(
    () => ({
      1: <RequestABooking />,
      2: <ConfirmBooking />,
    }),
    []
  )

  const onBack = useCallback(() => {
    if (step === 2) {
      handleSetStep(1)
    } else {
      if (isSignUpToConfirmBooking) {
        if (isOtp) {
          dispatch(setBookingRegistrationStep())
          dispatch(setIsSubmitting(false))
        }
        dispatch(setModal({}))
      } else {
        router.back()
      }
    }
  }, [handleSetStep, router, step, isOtp, isSignUpToConfirmBooking, dispatch])

  return {
    step,
    setStep,
    steps,
    currentStep: steps[step],
    onBack,
  }
}
