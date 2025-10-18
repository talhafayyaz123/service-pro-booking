import { Stripe } from '@stripe/stripe-js'
import { useRouter } from 'next/router'
import queryString from 'query-string'
import { useCallback, useLayoutEffect, useState } from 'react'

import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { sleep } from '@/core/helpers/sleep'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export const useAfterPayCheckout = (stripe: Stripe | null) => {
  const router = useRouter()
  const [loadingRetrivePayment, setLoadingRetrivePayment] = useState(true)

  const setStore = usePaymentLinkStore.getState().setStore

  const clientSecret = (router?.query?.payment_intent_client_secret ??
    '') as string

  const getStripeIntent = useCallback(async () => {
    await sleep(9000)

    try {
      const res = await stripe?.retrievePaymentIntent(clientSecret)
      const redirect = () => {
        router.replace(
          getUrlWithSearchParams(
            queryString.parseUrl(window.location.href).url,
            {
              price: String(res?.paymentIntent?.amount) ?? undefined,
              timestemp: String(res?.paymentIntent?.created) ?? undefined,
              currency: String(res?.paymentIntent?.currency) ?? undefined,
            }
          )
        )
      }

      if (res?.paymentIntent?.status === 'succeeded') {
        setStore({ step: [2, 2] })
        redirect()
        setLoadingRetrivePayment(false)
      } else {
        setStore({ step: [2, 3] })
        redirect()
        setLoadingRetrivePayment(false)
      }
    } catch (e) {
      setStore({ step: [2, 3] })
      setLoadingRetrivePayment(false)
    }
  }, [clientSecret, router, setStore, stripe])

  useLayoutEffect(() => {
    const clientSecret = (router?.query?.payment_intent_client_secret ??
      '') as string

    if (clientSecret && stripe) {
      setLoadingRetrivePayment(true)
      getStripeIntent()
    } else {
      setLoadingRetrivePayment(false)
    }
  }, [getStripeIntent, router?.query?.payment_intent_client_secret, stripe])

  return loadingRetrivePayment
}
