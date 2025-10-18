import { Elements } from '@stripe/react-stripe-js'
import { GetServerSideProps } from 'next'
import { getToken } from 'next-auth/jwt'
import useTranslation from 'next-translate/useTranslation'

import { useElementsOptions } from '@/components/Payment/useElementsOptions'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import getStripe from '@/core/helpers/getStripe'
import { BookingComponent } from '@/features/booking/BookingComponent'
import { useRedirectProToUserPage } from '@/hooks/useRedirectProToUserPage'
import BaseLayout from '@/layouts/BaseLayout'

const stripePromise = getStripe()

const BookingPage = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.booking)
  const { options } = useElementsOptions()
  useRedirectProToUserPage()

  return (
    <Elements stripe={stripePromise} options={options}>
      <BaseLayout
        seoTitle={t('seo_title')}
        seoDescription={t('seo_description')}
      >
        <BookingComponent />
      </BaseLayout>
    </Elements>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getToken(ctx)

  if (session?.role === 'PRO') {
    return {
      redirect: {
        destination: ROUTES.myProfile,
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

export default BookingPage
