import Link from 'next/link'

import { H14 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'

export const TermsAntPolicy = ({ buttonText }: { buttonText?: string }) => {
  const mainDomain = process.env.NEXT_PUBLIC_SITE_URL
  const store = usePaymentLinkStore((state) => state)

  const isExistUse = store.isExistEmail || store.isExistPhone

  if (!isExistUse && !store.isCreateAccount) {
    return <></>
  }

  return (
    <H14 color="text-black" className={'mb-4 block text-center'}>
      By clicking the {buttonText ?? 'Create account'} button, you are
      confirming that you have read and agreed to our{' '}
      <Link href={mainDomain + ROUTES.privacyPolicy}>
        <a target="_blank">
          <span
            role="button"
            className="!font-normal text-orange transition hover:text-orange1"
          >
            Privacy Policy
          </span>
        </a>
      </Link>{' '}
      and{' '}
      <Link
        href={getUrlWithSearchParams(mainDomain + ROUTES.termsAndConditions, {
          forRole: 'PRO',
        })}
      >
        <a target="_blank">
          <span
            role="button"
            className="!font-normal text-orange transition hover:text-orange1"
          >
            Terms of service
          </span>
        </a>
      </Link>
    </H14>
  )
}
