import { PaymentRequestButtonElement } from '@stripe/react-stripe-js'
import { PaymentRequest, Stripe, StripeElements } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'

import { createSetupIntent } from '@/api/payment/createSetupIntent'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H20 } from '@/components/typography'
import { useBaseInfoStep } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { PaymentMethods } from '@/features/paymentLink/components/Steps/PaymentProcessStep/components/common/PaymentMethods'
import {
  // bnplMethods,
  cardMethods,
} from '@/features/paymentLink/components/Steps/PaymentProcessStep/constatnts'
import { plInstance } from '@/features/paymentLink/store/paymentBaseQuery'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import { IPaymentStepOne } from '@/features/paymentLink/store/types'

export const PaymentMethodSection = ({
  // isEnableBnpl,
  stripe,
  elements,
}: {
  isEnableBnpl: boolean
  stripe: Stripe | null
  elements: StripeElements | null
}) => {
  const { totalPriceWithTips, data } = useBaseInfoStep()

  const { paymentMethod, setStore, bnpl } = usePaymentLinkStore()
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest | null>(
    null
  )

  useEffect(() => {
    if (!stripe || !elements) {
      return
    }

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      requestPayerName: true,
      requestPayerEmail: true,
      total: {
        label: 'Payment link',
        amount: Math.round(totalPriceWithTips * 100),
      },
    })

    pr.canMakePayment().then((result) => {
      if (result && !paymentRequest) {
        setPaymentRequest(pr as PaymentRequest)
      }
    })

    pr.on('paymentmethod', async (e) => {
      try {
        const paymentLinkState = usePaymentLinkStore.getState()
        const tipsAmount = (paymentLinkState.tipAmountFinal ?? 0).toFixed(2)

        const setupIntent = await createSetupIntent(plInstance)
        const response = await stripe.confirmCardSetup(
          setupIntent.clientSecret,
          {
            payment_method: e.paymentMethod.id,
          }
        )
        if (response.error) {
          paymentLinkState.setStore({
            step: [2, 3],
            finalErrorMessage: '',
          })
          e.complete('fail')
          return
        }

        if (response.setupIntent.status === 'succeeded') {
          await plInstance.post(
            data?.type !== 'QUICKPAY'
              ? `/v1/bookings/${data?.bookingId}/external-payment-link`
              : `/v1/quickpay/${data?.quickpayId}/pay-external-payment-link`,
            {
              setupIntentId: response?.setupIntent?.id,
              paymentMethodId: response?.setupIntent?.payment_method || null,
              tipsAmount:
                tipsAmount && Number(tipsAmount) > 0 ? Number(tipsAmount) : 0,
            }
          )
          paymentLinkState.setStore({ step: [2, 2] })

          e.complete('success')
        } else {
          paymentLinkState.setStore({
            step: [2, 3],
            finalErrorMessage: '',
          })
          e.complete('fail')
        }
      } catch (e) {
        const paymentLinkState = usePaymentLinkStore.getState()

        paymentLinkState.setStore({
          step: [2, 3],
          finalErrorMessage: '',
        })
      }
    })
  }, [
    data?.bookingId,
    data?.quickpayId,
    data?.type,
    elements,
    paymentRequest,
    stripe,
    totalPriceWithTips,
  ])

  return (
    <CardWrapper className={'laptop:p-8'}>
      <H20 className={'text-center mb-5 maxLaptop:hidden'}>
        Choose payment method
      </H20>

      <PaymentMethods
        value={bnpl ? null : paymentMethod}
        onChange={(paymentMethod) =>
          setStore({
            bnpl: null,
            paymentMethod: paymentMethod as IPaymentStepOne['paymentMethod'],
          })
        }
        options={cardMethods}
      />
      {paymentRequest && (
        <div className="mt-4">
          <PaymentRequestButtonElement
            options={{
              paymentRequest,
              style: {
                paymentRequestButton: {
                  height: '56px',
                },
              },
            }}
          />
        </div>
      )}
      {/* {isEnableBnpl && (
        <>
          <div
            className={'grid grid-cols-[1fr_auto_1fr] gap-4 items-center my-5'}
          >
            <div className={'w-full h-[1px] bg-lightGray'} />
            <H14 color={'text-gray'}>BUY NOW, PAY LATER</H14>
            <div className={'w-full h-[1px] bg-lightGray'} />
          </div>
          <PaymentMethods
            value={bnpl}
            withReset
            onChange={(bnpl) =>
              setStore({
                bnpl: bnpl as IPaymentStepOne['bnpl'],
              })
            }
            options={bnplMethods}
          />
        </>
      )} */}
    </CardWrapper>
  )
}
