import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { PAYMENT_METHODS } from '@/features/booking/confirmBooking/PaymentDropdown'
import { getAndCheckPLCookiesInfo } from '@/features/paymentLink/constants'
import { IPayExternalPlPayload } from '@/features/paymentLink/store/constatnts'
import { plInstance } from '@/features/paymentLink/store/paymentBaseQuery'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import {
  IBNPLVariants,
  IResult,
  TransformPLResponse,
} from '@/features/paymentLink/store/types'

export const paymentLinkBnplBooking = async (
  params: IPayExternalPlPayload
): Promise<IResult> => {
  const paymentLinkState = usePaymentLinkStore.getState()
  const bnplVariant = paymentLinkState.bnpl as IBNPLVariants
  const tipsAmount = (paymentLinkState.tipAmountFinal ?? 0).toFixed(2)

  const result: IResult = {
    status: 'success',
    errorMessage: '',
  }

  if (!params?.stripe || !bnplVariant) {
    result.status = 'error'
    result.errorMessage = 'Unknown error, please try again.'
    return result
  }

  try {
    const prepare = await prepareBnpl({
      tipsAmount: Number(tipsAmount),
      paymentMethod: bnplVariant,
      id: params.id,
      type: params?.type,
    })

    if (prepare.error) {
      result.status = 'error'
      result.errorMessage =
        typeof prepare.data === 'string'
          ? prepare.data
          : 'Unknown error, please try again.'
      return result
    }

    const PAYMENT_OPTIONS = {
      AFFIRM: params?.stripe?.confirmAffirmPayment,
      AFTERPAY: params.stripe?.confirmAfterpayClearpayPayment,
      KLARNA: params.stripe?.confirmKlarnaPayment,
    } as const
    //
    const returnUrl = getUrlWithSearchParams(
      window.location.origin + window.location.pathname,
      {
        payment_option: bnplVariant,
        payment_type: PAYMENT_METHODS.PAY_IN_BNPL,
        payment_status: 'pending',
        date: '',
      }
    )
    const creds = getAndCheckPLCookiesInfo()

    const billing_details = {
      email: paymentLinkState.email ?? creds?.email,
      name: paymentLinkState?.paymentCreds.address.name ?? '',
      address: {
        ...paymentLinkState.paymentCreds.address.value,
        line2: paymentLinkState.paymentCreds.address.value.line2 ?? undefined,
        country: paymentLinkState?.paymentCreds.address.value.country as string,
      },
    }

    const bnplRes = await PAYMENT_OPTIONS?.[bnplVariant](
      prepare?.data?.clientSecret as string,
      {
        payment_method: {
          billing_details,
        },
        shipping: {
          name: billing_details.name,
          address: {
            ...billing_details?.address,
            line1: billing_details.address.line1 as string,
          },
        },
        return_url: returnUrl,
      }
    )

    if (bnplRes?.error?.message) {
      result.errorMessage = bnplRes?.error?.message
      result.status = 'error'
    }
  } catch (e) {
    result.errorMessage = 'Error'
    result.status = 'error'
    return result
  }

  return result
}

export interface IPrepareParams {
  id?: string
  paymentMethod: string
  tipsAmount: number
  type?: TransformPLResponse['type']
}

export interface IPrepareResponse {
  clientSecret: string
  customerId: string
}

const prepareBnpl = async ({
  tipsAmount,
  paymentMethod,
  id,
  type,
}: IPrepareParams) => {
  try {
    const response = await plInstance.post<IPrepareResponse>(
      type !== 'QUICKPAY'
        ? `/v1/bookings/${id}/prepare-bnpl`
        : `/v1/quickpay/${id}/prepare-bnpl`,
      { tipsAmount, paymentMethod }
    )
    return {
      data: response.data,
      error: false,
    }
  } catch (e: any) {
    return {
      data: e?.response?.data?.message ?? null,
      error: true,
    }
  }
}
