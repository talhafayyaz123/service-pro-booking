import { Elements } from '@stripe/react-stripe-js'
import { GetServerSideProps } from 'next'
import useTranslation from 'next-translate/useTranslation'

import { NotFoundPic } from '@/components/common/NotFoundPic'
import { SpinnerFullScreen } from '@/components/Loaders'
import { useElementsOptions } from '@/components/Payment/useElementsOptions'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import getStripe from '@/core/helpers/getStripe'
import { CheckoutLink } from '@/features/paymentLink/CheckoutLink'
import { DepositRequestedBooking } from '@/features/paymentLink/DepositRequestedBooking'
import { _PaymentLink } from '@/features/paymentLink/PaymentLink'
import { useGetInfoByExternalLinkQuery } from '@/features/paymentLink/store/paymentLinkApi'
import BaseLayout from '@/layouts/BaseLayout'

const stripePromise = getStripe()

const PaymentLink = ({ id }: { id: string }) => {
  const { isFetching, isSuccess, isError, data } =
    useGetInfoByExternalLinkQuery(id)

  // always only one of them is true
  const isDepositLink = !!data?.booking && data?.type === 'DEPOSIT_TRANSFER'
  const isQuickPayLink = !!data?.quickpay && data?.type === 'QUICKPAY'
  const isCheckoutLink = !data?.quickpay && data?.type === 'BOOKING_COMPLETED'

  const { options } = useElementsOptions()
  const { t } = useTranslation(TRANSLATE_KEYS.booking)

  return (
    <Elements stripe={stripePromise} options={options}>
      <BaseLayout
        seoTitle={t('Payment link')}
        seoDescription={t('Payment link')}
      >
        {isFetching && <SpinnerFullScreen />}
        {isSuccess && (
          <>
            {isDepositLink && <DepositRequestedBooking />}
            {isQuickPayLink && <_PaymentLink />}
            {isCheckoutLink && <CheckoutLink />}
          </>
        )}
        {isError && <NotFoundPic title={'Unknown error'} subtitle={''} />}
      </BaseLayout>
    </Elements>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      id: ctx.query?.bookingId ?? '',
    },
  }
}
export default PaymentLink
