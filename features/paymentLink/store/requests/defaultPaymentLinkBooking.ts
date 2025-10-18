import { PaymentMethodCreateParams } from '@stripe/stripe-js'
import { AxiosError } from 'axios'

import { createSetupIntent } from '@/api/payment/createSetupIntent'
import { IPayExternalPlPayload } from '@/features/paymentLink/store/constatnts'
import { plInstance } from '@/features/paymentLink/store/paymentBaseQuery'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import { IResult } from '@/features/paymentLink/store/types'

export const defaultPaymentLinkBook = async (params: IPayExternalPlPayload) => {
  const paymentLinkState = usePaymentLinkStore.getState()
  const tipsAmount = (paymentLinkState.tipAmountFinal ?? 0).toFixed(2)
  let setupIntentId = null
  let paymentMethodId = null

  const result: IResult = {
    status: 'success',
    errorMessage: '',
  }

  const setupIntent = await createSetupIntent(plInstance)
  if (params.card) {
    const response = await params.stripe?.confirmCardSetup(
      setupIntent.clientSecret,
      {
        payment_method: {
          card: params.card,
          billing_details: {
            name: paymentLinkState.paymentCreds.address.name,
            phone: paymentLinkState.paymentCreds.address.phone,
            address: paymentLinkState.paymentCreds.address.value,
          } as PaymentMethodCreateParams.BillingDetails,
        },
      }
    )
    if (response?.error) {
      result.status = 'error'
      result.errorMessage =
        response.error.message ?? 'Unknown error occurred, please try again.'
      return result
    }
    setupIntentId = response?.setupIntent?.id
    paymentMethodId = response?.setupIntent?.payment_method || null
  } else {
    result.errorMessage = 'Unknown error'
    result.status = 'error'
    return result
  }
  if (setupIntentId && paymentMethodId) {
    try {
      const res = await plInstance.post(
        params.type !== 'QUICKPAY'
          ? `/v1/bookings/${params.id}/external-payment-link`
          : `/v1/quickpay/${params.id}/pay-external-payment-link`,
        {
          setupIntentId: setupIntentId,
          paymentMethodId: paymentMethodId,
          tipsAmount:
            tipsAmount && Number(tipsAmount) > 0 ? Number(tipsAmount) : 0,
        }
      )
      if (!res?.data?.result) {
        result.status = 'error'
        result.errorMessage = 'Unknown error occurred, please try again.'
        return result
      } else {
        result.status = 'success'
        result.errorMessage = ''
        return result
      }
    } catch (e: any) {
      const error = e as AxiosError<any>

      result.status = 'error'
      result.errorMessage =
        errorsCode?.[error?.response?.data?.message as string] ??
        'Unknown error'
    }
  }
  return result
}

const errorsCode: Record<string, string> = {
  BOOKING_STATUS_IS_NOT_CONFIRMED: 'Booking status is not confirmed',
}
