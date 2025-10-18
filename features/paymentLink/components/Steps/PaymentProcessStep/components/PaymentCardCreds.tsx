import { AddressElement, CardNumberElement } from '@stripe/react-stripe-js'
import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { NewPaymentCvcElement } from '@/components/Payment/PaymentCvcElement'
import { NewPaymentExpirationElement } from '@/components/Payment/PaymentExpirationElement'
import { H20, Label } from '@/components/typography'
import {
  addressProps,
  cardNumberProps,
} from '@/features/paymentLink/components/Steps/PaymentProcessStep/constatnts'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export interface IPaymentCardCredsProps {
  errorMessage?: string
}

export const PaymentCardCreds = memo(
  ({ errorMessage }: IPaymentCardCredsProps) => {
    const { setPaymentCreds, bnpl } = usePaymentLinkStore()

    return (
      <article className={'laptop:mb-6'}>
        {!bnpl && (
          <CardWrapper className={'mt-6'}>
            <H20 className={'text-center'}>Card details</H20>
            {errorMessage && (
              <H20 className={'mt-2'} color={'text-cancelled'}>
                {errorMessage}
              </H20>
            )}

            <Label
              className={`flex small:mb-2 mb-2.5 overflow-hidden mt-6 !text-16 !font-sans !text-[#4B5563FF]`}
            >
              Card number
            </Label>

            <CardNumberElement
              id="CARD_ELEMENT"
              {...cardNumberProps}
              onChange={({ complete, error }) => {
                setPaymentCreds({
                  card: {
                    isCompleteCard: complete,
                    message: error?.message ?? '',
                  },
                })
              }}
            />
            <div className="grid grid-cols-2 mt-6 mb-3 gap-x-5">
              <NewPaymentExpirationElement />
              <NewPaymentCvcElement />
            </div>
          </CardWrapper>
        )}

        <CardWrapper className="mt-6">
          <H20 className={'text-center mb-6'}>Billing address</H20>
          <AddressElement
            onChange={(evt) => {
              setPaymentCreds({
                address: {
                  value: evt.value.address,
                  phone: evt.value.phone || '',
                  firstName: evt.value.firstName || '',
                  lastName: evt.value.lastName || '',
                  name: evt.value.name || '',
                  isComplete: evt.complete,
                },
              })
            }}
            {...addressProps}
          />
        </CardWrapper>
      </article>
    )
  }
)
