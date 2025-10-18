import { memo } from 'react'

import { IconLeftSmile } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { H16, H28 } from '@/components/typography'
import { AddInfoForm } from '@/features/paymentLink/components/Steps/AddInfoStep/components/common/AddInfoForm'
import { TermsAntPolicy } from '@/features/paymentLink/components/Steps/AddInfoStep/components/common/TermsAntPolicy'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useMediaScreen } from '@/hooks/useMediaScreen'

interface IProps {
  isWalkInBookingDeposit?: boolean
}

export const AddInfoStepMobile = memo(({ isWalkInBookingDeposit }: IProps) => {
  const setStore = usePaymentLinkStore.getState().setStore
  const addInfoFormStep = usePaymentLinkStore((state) => state.addInfoFormStep)
  const { setIsInfoPhotoUpload } = useDepositRequestedBookingStore()
  const { isSmall } = useMediaScreen()
  const onBack = () => {
    if (addInfoFormStep === 2) {
      setStore({ addInfoFormStep: 1 })
    } else {
      setStore({ step: [1, 1] })
      setIsInfoPhotoUpload(false)
    }
  }

  return (
    <section
      className="flex flex-col h-screen"
      id={!isSmall ? 'app_layout' : undefined}
    >
      <div className="flex flex-col h-full">
        <header className="flex justify-between flex-none px-5 py-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 rounded-full shadow-xl"
          >
            <div className="p-[3px] small:mt-[-2px]">
              <IconLeftSmile />
            </div>
          </button>
          <LogoButtonSubdomain className="mr-[13px]" />
          <div className="w-10" />
        </header>

        <div className="overflow-auto !scrollbar-hide flex-grow flex flex-col h-full  bg-violet">
          <section className="flex flex-col flex-grow">
            <article className="p-6 bg-violet">
              <H28>Add your info</H28>
              <H16 color="text-gray" className="mt-4">
                Please, add your information to proceed to payment.
              </H16>
            </article>
            <div className="flex-grow bg-white rounded-t-3xl">
              <AddInfoForm />
            </div>
          </section>
        </div>
        <div className="flex-none bg-white">
          <CardWrapper className="flex flex-col items-center px-5 py-3 rounded-b-none">
            {!isWalkInBookingDeposit && (
              <TermsAntPolicy buttonText={'cccProceed to confirmation'} />
            )}
            <Button
              form="ADD_INFO_FORM"
              className="w-full"
              type="submit"
              buttonType="orange"
            >
              {addInfoFormStep === 1 ? 'Continue' : 'Proceed to confirmation'}
            </Button>
          </CardWrapper>
        </div>
      </div>
    </section>
  )
})
