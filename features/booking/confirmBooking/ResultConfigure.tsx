import Image from 'next/image'
import { useCallback, useMemo } from 'react'

import { IconPan } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { ResultConfigureCard } from '@/components/cards/ResultConfigure'
import TextArea from '@/components/common/TextArea'
import { H16, H18, H20, H24 } from '@/components/typography'
import { addDurationToTime } from '@/core/helpers/addDurationToTime'
import { calculateDeposit } from '@/core/helpers/calculateDepositBE'
import { formatPrice } from '@/core/helpers/formatPrice'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { thFormatDate } from '@/core/helpers/helperForDate'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import { AddonConfirmList } from '@/features/booking/addOns/AddonConfirmList'
import { checkIsPayWithCard } from '@/features/booking/bookingHelpers'
import { ServiceInfo } from '@/features/booking/components/ServiceInfo'
import { ConfirmBookWarning } from '@/features/booking/confirmBooking/PaymentMethod'
import { useConfirmBooking } from '@/features/booking/confirmBooking/useConfirmBooking'
import { displayDepositAndWarning } from '@/features/booking/helpers/displayDepositAndWarning'
import {
  addedServicesSelector,
  bookingDataSelector,
} from '@/features/booking/store/bookingSelectors'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { meSelector } from '@/store/me/meSelector'

import { setStep } from '../store/bookingStore'
import { DepositCard } from './DepositCard'

export const ResultConfigure = () => {
  const addedServices = useAppSelector(addedServicesSelector)
  const { data } = useAppSelector(bookingDataSelector)
  const isCardPay = checkIsPayWithCard(data.paymentMethod?.value)

  const profileInfo = useAppSelector(profileSelector)
  const currencySign = getCurrencySignByName(profileInfo.data.currency || '')
  const { isSmall, isTablet } = useMediaScreen()

  const { totalPrice, totalTax, taxPercent, travelFee } = useConfirmBooking()

  const termsOfPaymentData = useAppSelector(
    (state) => state.profile.termsOfPayment
  )

  const proInfo = useAppSelector((state) => state.profile.iProInfo)
  const source = proInfo?.data?.source

  const depositAmount = calculateDeposit({
    proTermsOfPayment: termsOfPaymentData.data,
    source,
    totalAmount: totalPrice,
    totalServices: totalPrice - totalTax,
  })

  const clientBalance = useAppSelector(meSelector)?.clientBalance

  const walletCredits = useMemo(() => {
    if (!clientBalance) {
      return 0
    }
    if (clientBalance > depositAmount) {
      return depositAmount
    } else if (clientBalance < depositAmount) {
      return clientBalance
    } else if (clientBalance === depositAmount) {
      return clientBalance
    }
  }, [clientBalance, depositAmount])

  const cardPayCredits = useMemo(() => {
    if (!clientBalance) {
      return 0
    }
    if (clientBalance >= depositAmount) {
      return 0
    } else if (clientBalance < depositAmount) {
      return depositAmount - clientBalance
    }
  }, [clientBalance, depositAmount])

  const bookingSource = profileInfo.data.source

  // Diplaying "Deposit due box" and warning logic
  const displayDepositDueBoxAndWarning = displayDepositAndWarning({
    totalPrice,
    depositAmount,
    isCardPay,
  })

  return (
    <>
      <ResultConfigureCard
        headerWrapperClassName="tablet:pt-8"
        warning={
          bookingSource !== 'DIRECT' &&
          displayDepositDueBoxAndWarning && (
            <div className="mt-4 tablet:hidden">
              <ConfirmBookWarning mobile />
            </div>
          )
        }
        header={
          <>
            <div>
              <H24 className="!font-normal maxTablet:text-18">{`${thFormatDate(
                data.date
              )} ${
                !isSmall || !isTablet ? data.startTime?.label || '' : ''
              }`}</H24>

              <div className="flex items-center maxTablet:mt-1  mt-1.5 gap-2.5">
                {profileInfo.data.iconUrl ? (
                  <UserIcon
                    size={isSmall || isTablet ? '24' : '28'}
                    iconUrl={profileInfo.data.iconUrl}
                  />
                ) : (
                  <div
                    className={
                      'w-6 h-6 tablet:w-7 tablet:h-7  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
                    }
                  >
                    <Image alt={'alt pro icon'} src={ImgProUser} />
                  </div>
                )}
                <H18 className={'maxTablet:text-[16px]'} color={'text-gray'}>
                  {profileInfo.data.name}
                </H18>
              </div>
            </div>
            <PanButton className={'maxTablet:!p-2'} />
          </>
        }
        footer={
          <>
            {travelFee ? (
              <div className="flex items-center justify-between mb-2">
                <H18>Travel fee</H18>
                <H20 color={'text-orange'}>
                  {formatPrice({ price: travelFee, currency: currencySign })}
                </H20>
              </div>
            ) : null}
            {taxPercent ? (
              <div className="flex items-center justify-between mb-2">
                <H18>
                  Tax <span className="text-gray">{`(${taxPercent}%)`}</span>
                </H18>
                <H18>
                  {formatPrice({ price: totalTax, currency: currencySign })}
                </H18>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <H18>Total</H18>
              <H18 className="text-orange !font-bold desktop:!font-normal desktop:text-black">
                {formatPrice({ price: totalPrice, currency: currencySign })}
              </H18>
            </div>
            {!!walletCredits && data.useWallet && (
              <div className="flex items-center justify-between my-2">
                <H16 color="text-gray">Pay with wallet credits</H16>
                <H16 color="text-gray">
                  {formatPrice({
                    price: walletCredits,
                    currency: currencySign,
                  })}
                </H16>
              </div>
            )}
            {!!cardPayCredits && data.useWallet && (
              <div className="flex items-center justify-between my-2">
                <H16 color="text-gray">Pay by card</H16>
                <H16 color="text-gray">
                  {formatPrice({
                    price: cardPayCredits,
                    currency: currencySign,
                  })}
                </H16>
              </div>
            )}
            {displayDepositDueBoxAndWarning && depositAmount && (
              <DepositCard depositAmount={depositAmount} className="mt-4" />
            )}
          </>
        }
        mainWrapperClassName="tablet:mt-6 tablet:mb-8"
        main={
          <>
            <div className="grid gap-6">
              {addedServices.map((el) => (
                <ServiceInfo
                  currencySign={currencySign}
                  middleInfo={
                    <div className="mt-2 maxTablet:mt-1">
                      <span className="flex items-center gap-2 text-gray">
                        <div>
                          {data.startTime?.label} -{' '}
                          {addDurationToTime(
                            data.startTime?.label || '',
                            el.duration
                          )}
                        </div>
                        <div className="size-[2px] bg-black rounded-full" />
                        {setDurationTime(el.duration)}{' '}
                      </span>
                    </div>
                  }
                  className="p-0 rounded-none shadow-none"
                  key={el.id}
                  button={formatPrice({
                    price: el.price,
                    currency: currencySign,
                  })}
                  {...el}
                  taxPrice={0}
                  extraTime={0}
                />
              ))}
            </div>
            <AddonConfirmList />
            {data.comment ? (
              <TextArea className="mt-6" readOnly value={data.comment} />
            ) : null}
          </>
        }
      />
    </>
  )
}

const PanButton = ({ className }: { className?: string }) => {
  const dispatch = useAppDispatch()
  const handleSetStep = useCallback(() => dispatch(setStep(1)), [dispatch])
  return (
    <div
      role="button"
      onClick={handleSetStep}
      className={`p-2.5 rounded-full border border-lightGray h-fit hover:bg-lightGray transition ${className}`}
    >
      <IconPan />
    </div>
  )
}
