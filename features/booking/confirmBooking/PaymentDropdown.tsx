import { differenceInDays } from 'date-fns'
import moment from 'moment/moment'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'

import {
  IconCreditCard,
  IconPayInCash,
  IconPayInCashOrange,
  IconPaylater,
  IconWalletIcon,
} from '@/assets/icons/icons'
import { NewDropdown } from '@/components/common/dropdown/NewDropdown'
import { SwitcherXl } from '@/components/common/Switcher'
import { H14, H16 } from '@/components/typography'
import {
  calculateDeposit,
  UserSourceTypeEnum,
} from '@/core/helpers/calculateDepositBE'
import { formatPrice } from '@/core/helpers/formatPrice'
import { useConfirmBooking } from '@/features/booking/confirmBooking/useConfirmBooking'
import { bookingDataSelector } from '@/features/booking/store/bookingSelectors'
import {
  setBookingData,
  updatePaymentState,
} from '@/features/booking/store/bookingStore'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'
import { IOptions } from '@/types/common'

export const PaymentDropdown = () => {
  const dispatch = useAppDispatch()
  const { data } = useAppSelector(bookingDataSelector)
  const { icons, optionsData, onChangePayment, depositAmount } =
    usePaymentDropdownConfig(data.paymentMethod)
  const me = useAppSelector(meSelector)
  const source = useAppSelector((state) => state.profile.iProInfo?.data?.source)

  const onChangeWallet = (useWallet: boolean) => {
    dispatch(setBookingData({ useWallet }))
  }

  useEffect(() => {
    dispatch(
      setBookingData({ paymentMethod: optionsData[0], proSource: source })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <div className="pb-6 my-6 border-b border-lightGray">
      <NewDropdown
        options={optionsData}
        alternativeRender={(v) => (
          <div className={'flex items-center gap-4'}>
            {icons[v?.value || ''].icon}
            {icons[v?.value || ''].text}
          </div>
        )}
        withRadio
        value={data.paymentMethod}
        onChange={onChangePayment}
      />
      {me?.clientBalance > 0 && depositAmount > 0 && (
        <div
          className={
            'grid mt-6 grid-cols-[auto_1fr_auto] items-center gap-2 px-5 py-2 overflow-x-hidden bg-white border rounded-xl border-lightGray'
          }
        >
          <div>
            <div
              className={
                'overflow-hidden relative  border-white  rounded-full w-11 h-11 border-[2px] flex items-center justify-center bg-pink shadow-base'
              }
            >
              <IconWalletIcon />
            </div>
          </div>
          <div>
            <H16>Use wallet credits</H16>
            <H14>
              Available credits:
              {formatPrice({ price: me?.clientBalance ?? 0, currency: 'usd' })}
            </H14>
          </div>
          <SwitcherXl checked={data.useWallet} setChecked={onChangeWallet} />
        </div>
      )}
    </div>
  )
}

const usePaymentDropdownConfig = (value?: IOptions) => {
  const dispatch = useAppDispatch()

  const iconColor = useCallback(
    (id: string) => (value?.id === id ? `stroke-orange ` : `stroke-black`),
    [value?.id]
  )
  const {
    data: { date, paymentMethod },
    termsOfPayment: { payInBnpl },
  } = useAppSelector(bookingDataSelector)

  const profileInfo = useAppSelector(profileSelector)

  const bookingDate = date || moment().utc().toDate()
  const days = differenceInDays(bookingDate, moment().utc().toDate()) + 1

  const termsOfPaymentData = useAppSelector(
    (state) => state.profile.termsOfPayment
  )
  const source = useAppSelector((state) => state.profile.iProInfo?.data?.source)
  const { totalPrice, totalTax } = useConfirmBooking()

  const depositAmount = calculateDeposit({
    proTermsOfPayment: termsOfPaymentData.data,
    source,
    totalAmount: totalPrice,
    totalServices: totalPrice - totalTax,
  })

  const isAvailableBNPL =
    50 <= totalPrice && totalPrice <= 2000 && payInBnpl && days < 28

  const showBNPLOption = useMemo(() => {
    if (
      [
        UserSourceTypeEnum.MARKETPLACE,
        UserSourceTypeEnum.MARKETPLACE_NEW,
      ].includes(source as UserSourceTypeEnum)
    ) {
      return 50 <= totalPrice && totalPrice <= 2000 && days < 28
    } else {
      return isAvailableBNPL
    }
  }, [days, isAvailableBNPL, source, totalPrice])

  const onChangePayment = useCallback(
    (paymentMethod: IOptions) => {
      dispatch(setBookingData({ paymentMethod }))
      dispatch(
        updatePaymentState({
          useAnotherCard: false,
        })
      )
    },
    [dispatch]
  )

  const icons: Record<string, { icon: ReactNode; text: string }> = {
    [PAYMENT_METHODS.PAY_IN_APP]: {
      icon: <IconCreditCard className={`stroke-black`} />,
      text: 'Credit card',
    },
    [PAYMENT_METHODS.PAY_IN_CASH]: {
      icon: <IconPayInCash />,
      text: 'Pay in cash',
    },
    [PAYMENT_METHODS.PAY_IN_BNPL]: {
      icon: <IconPaylater />,
      text: 'Buy now, Pay later',
    },
  }

  const optionsData: IOptions[] = useMemo(
    () =>
      [
        {
          value: PAYMENT_METHODS.PAY_IN_APP,
          text: 'Credit card',
          icon: (
            <IconCreditCard
              className={`${iconColor('creditCard')} transition`}
            />
          ),
        },

        ...(profileInfo?.data?.source !== 'MARKETPLACE' && depositAmount === 0
          ? [
              {
                value: PAYMENT_METHODS.PAY_IN_CASH,
                text: 'Pay in cash',
                icon:
                  value?.id === PAYMENT_METHODS.PAY_IN_CASH ? (
                    <IconPayInCashOrange />
                  ) : (
                    <IconPayInCash />
                  ),
              },
            ]
          : []),
        ...(showBNPLOption
          ? [
              {
                value: PAYMENT_METHODS.PAY_IN_BNPL,
                text: 'Buy now, Pay later',
                icon: <IconPaylater />,
              },
            ]
          : []),
      ].map(({ value, text, ...rest }) => ({
        value,
        id: value,
        label: (
          <div className="flex items-center gap-4">
            {rest.icon}
            {text}
          </div>
        ),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [iconColor, profileInfo?.data?.source, value?.id, depositAmount]
  )

  useEffect(() => {
    if (
      paymentMethod?.value === PAYMENT_METHODS.PAY_IN_BNPL &&
      !showBNPLOption
    ) {
      onChangePayment(optionsData[0])
    }
  }, [showBNPLOption, onChangePayment, optionsData, paymentMethod?.value])

  return { icons, optionsData, onChangePayment, depositAmount }
}

export const PAYMENT_METHODS = {
  PAY_IN_APP: 'PAY_IN_APP',
  PAY_IN_CASH: 'PAY_IN_CASH',
  GOOGLE_PAY: 'GOOGLE_PAY',
  APPLE_PAY: 'APPLE_PAY',
  PAY_IN_BNPL: 'PAY_IN_BNPL',
}
