import { AddressElement } from '@stripe/react-stripe-js'
import { StripeAddressElementOptions } from '@stripe/stripe-js'
import { useMemo, useState } from 'react'

import {
  IconAffirmSmall,
  IconAfterpaySmall,
  IconKlarnaSmall,
} from '@/assets/icons/icons'
import { Radio } from '@/components/common/Radio'
import { useConfig } from '@/components/Payment/NewPaymentItems'
import { PaymentErrorText } from '@/components/Payment/PaymentErrorText'
import { updatePaymentState } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { billingDataSelector } from '@/store/billingMethodsStore/billingMethodsSlice'
import { meSelector } from '@/store/me/meSelector'
import { INewPaymentElementsState } from '@/types/payment'

export const AddPaylaterForm = () => {
  const [payment, setPayment] = useState('')
  const error = useAppSelector(
    (state) => state.billingMethods.globalErrorMessage
  )

  const dispatch = useAppDispatch()
  const { handleSet } = useConfig()
  const billing_details = useAppSelector(billingDataSelector)

  const handlePayLater = async (
    paymentOption: 'KLARNA' | 'AFFIRM' | 'AFTERPAY'
  ) => {
    dispatch(updatePaymentState({ paymentOption }))
    setPayment(paymentOption)
  }

  const me = useAppSelector(meSelector)
  const addressOptions: StripeAddressElementOptions = useMemo(
    () => ({
      fields: { phone: 'never' },
      display: { name: 'full' },
      mode: 'billing',
      defaultValues: {
        name: (me?.firstName || '') + ' ' + (me?.lastName || ''),
        address: {
          ...billing_details?.address,
          country: me.countryCode || '',
        },
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [me?.firstName, me?.lastName, me?.countryCode]
  )

  return (
    <div className="mt-6 mb-8 small:mt-4 flex flex-col justify-start items-start gap-3">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() =>
            handlePayLater(option.value as 'KLARNA' | 'AFTERPAY' | 'AFFIRM')
          }
          className="w-full flex flex-row justify-start items-center py-4 pl-5 pr-4 rounded-xl border border-lightGray"
        >
          <section className="flex justify-center items-center gap-3">
            <option.Icon />
            <span>{option.label}</span>
          </section>
          <Radio
            className="ml-auto"
            value={option.value}
            checked={payment === option.value}
          />
        </button>
      ))}
      {error && <PaymentErrorText error={error} />}
      <Address handleSet={handleSet} addressOptions={addressOptions} />
    </div>
  )
}

const Address = ({
  handleSet,
  addressOptions,
}: {
  handleSet: (data: Partial<INewPaymentElementsState>) => void
  addressOptions: StripeAddressElementOptions
}) => {
  return (
    <div className="w-full">
      <AddressElement
        onChange={(evt) =>
          handleSet({
            address: {
              value: evt.value.address,
              phone: evt?.value?.phone || '',
              firstName: evt.value.firstName || '',
              lastName: evt.value.lastName || '',
              name: evt.value.name || '',
              isComplete: evt.complete,
            },
          })
        }
        options={addressOptions}
      />
    </div>
  )
}

const options = [
  {
    value: 'KLARNA',
    label: 'Klarna',
    Icon: IconKlarnaSmall,
  },
  {
    value: 'AFFIRM',
    label: 'Affirm',
    Icon: IconAffirmSmall,
  },
  {
    value: 'AFTERPAY',
    label: 'Afterpay',
    Icon: IconAfterpaySmall,
  },
]
