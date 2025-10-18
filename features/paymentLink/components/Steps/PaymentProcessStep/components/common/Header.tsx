import { IconLeftSmile } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useMediaScreen } from '@/hooks/useMediaScreen'

export const Header = () => {
  const { isSmall, isTablet, isLaptop } = useMediaScreen()
  const isDesktop = !isSmall && !isTablet && !isLaptop
  const setStore = usePaymentLinkStore.getState().setStore
  const photoUploadStep = useDepositRequestedBookingStore.getState().step

  const onClick = () => {
    if (photoUploadStep === 'payment') {
      setStore({ step: [1, 1] })
      return
    }

    setStore({ step: [1, 2] })
  }

  return isDesktop ? (
    <header className="px-5 tablet:px-20 flex justify-between items-center shadow-xl h-[72px] small:h-[82px]">
      <Button
        size="42"
        className="!px-3 !border !border-lightGray maxTablet:hidden"
        buttonType="withIcon"
        onClick={onClick}
      >
        Back
      </Button>
      <LogoButtonSubdomain className="mr-[13px]" />
      <div />
    </header>
  ) : (
    <header className="flex-none flex justify-between py-4 px-5 z-[2] bg-white">
      <button
        onClick={onClick}
        className="rounded-full shadow-xl w-10 h-10 flex items-center justify-center"
      >
        <div className="p-[3px] small:mt-[-2px]">
          <IconLeftSmile />
        </div>
      </button>
      <LogoButtonSubdomain className="mr-[13px]" />
      <div className="w-10" />
    </header>
  )
}
