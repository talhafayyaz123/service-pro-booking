import { useRouter } from 'next/router'
import { memo, ReactNode } from 'react'

import {
  IconAffirmSmallBnpl,
  IconAfterpaySmall,
  IconDollarCircle,
  IconEllipse,
  IconKlarnaSmall,
} from '@/assets/icons/icons'
import { ImageBNPLIcons } from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Accordion } from '@/components/common/Accordion'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H18, H20, H40 } from '@/components/typography'
import { formatPrice } from '@/core/helpers/formatPrice'
import { isDirectId } from '@/core/helpers/isDirectProId'
import { Questions } from '@/features/profile/components/termsOfPayment/Questions'
import { ITermsOfPayment } from '@/features/profile/profileType'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { CancellationPolicyText } from '@/shared/cancelations/CancellationPolicyText'

export const ProfileTermsOfPayment = memo(() => {
  const { status } = useAppSelector((state) => state.profile.termsOfPayment)
  const profile = useAppSelector((state) => state.profile)
  const about = useAppSelector((state) => state?.profile.about?.data)
  const isPayInBnpl = useAppSelector(
    (state) => state.profile.iProInfo.data.payInBnpl
  )
  const router = useRouter()
  const proId = router.query.proId as string
  const { cancellationPolicies, payInApp, payInBnpl } = useCards()
  // const profileInfo = useAppSelector(profileSelector)
  const isSubscribed =
    (about as { subscriptionStatus?: string })?.subscriptionStatus ===
      'ACTIVE' ||
    (about as { subscriptionStatus?: string })?.subscriptionStatus === 'TRIAL'
  return (
    <>
      <div className={'container pr-0 maxSmall:hidden mb-8'}>
        <div className="flex sm:flex-wrap md:flex-wrap lg:flex-nowrap pr-0 border-b border-lightGray">
          <H40
            className={
              'w-[40%] sm:w-full md:w-full lg:w-[40%] !font-bold flex-1 '
            }
          >
            Payment <br /> policies
          </H40>
          <div className="w-[60%] sm:w-full md:w-full lg:lg:w-[60%] grid grid-cols-1 laptop:grid-cols-1 desktop:grid-cols-1 gap-10 pb-[60px] px-6">
            {status ? (
              <>
                <BaseSkeleton className="!w-full h-[130px] laptop:h-[253px]" />
                <BaseSkeleton className="!w-full h-[130px] laptop:h-[253px]" />
                <BaseSkeleton className="!w-full h-[130px] laptop:h-[253px]" />
              </>
            ) : (
              <>
                <TermsOfPayCard {...cancellationPolicies} />
                {/* {payInCash && profileInfo?.data?.source !== 'MARKETPLACE' && (
                  <TermsOfPayCard {...payInCash} />
                )} */}
                {payInApp && <TermsOfPayCard {...payInApp} />}
                {!isDirectId(proId) ||
                (isPayInBnpl &&
                  profile?.termsOfPayment.data.payInBnpl &&
                  isSubscribed &&
                  isDirectId(proId)) ? (
                  <TermsOfPayCard {...payInBnpl} />
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>
      <Questions />
    </>
  )
})

export const ProfileTermsOfPaymentMobile = memo(() => {
  const { payInApp, payInCash, cancellationPolicies, payInBnpl } = useCards()
  const profileInfo = useAppSelector(profileSelector)
  const router = useRouter()
  const proId = router.query.proId as string
  const about = useAppSelector((state) => state?.profile.about?.data)
  const isSubscribed =
    (about as { subscriptionStatus?: string })?.subscriptionStatus ===
      'ACTIVE' ||
    (about as { subscriptionStatus?: string })?.subscriptionStatus === 'TRIAL'
  return (
    <div className={'small:hidden'}>
      <CardWrapper className={'mb-4 mt-6'}>
        <H20>Cancellation policies</H20>
        <H18 color={'text-gray'} className={'maxSmall:text-16 mt-3'}>
          {cancellationPolicies.text}
        </H18>
      </CardWrapper>
      <CardWrapper>
        <H20 className={'mb-1'}> Terms of Payment</H20>
        {payInCash && profileInfo?.data?.source !== 'MARKETPLACE' && (
          <Accordion
            className={` py-4 ${payInApp ? 'border-b border-lightGray' : ''} `}
            textClassName={'mt-4'}
            {...payInCash}
            title={payInCash.label}
          />
        )}
        {payInApp && (
          <Accordion
            className={` ${
              payInBnpl ? 'border-b border-lightGray py-4' : 'pt-4 pb-0'
            }`}
            textClassName={'mt-4'}
            {...payInApp}
            title={payInApp.label}
          />
        )}
        {!isDirectId(proId) ||
        (profileInfo?.data?.payInBnpl && isSubscribed) ? (
          <Accordion
            className={' pt-4 pb-0'}
            textClassName={'mt-4'}
            {...payInBnpl}
            title={payInBnpl.label}
          />
        ) : null}
      </CardWrapper>
    </div>
  )
})

const TermsOfPayCard = ({
  text,
  label,
}: {
  text: ReactNode
  label: ReactNode
}) => {
  return (
    <CardWrapper className={'p-6'}>
      <div className={'pb-5 border-b border-lightGray'}>{label}</div>
      <div className={'mt-5'}>{text}</div>
    </CardWrapper>
  )
}

const useCards = () => {
  const data = useAppSelector((state) => state.profile.termsOfPayment.data)
  const name = useAppSelector((state) => state.profile.iProInfo.data.name)

  // eslint-disable-next-line no-constant-condition
  const payInCash = false
    ? {
        label: (
          <div className="flex items-center gap-4">
            <IconDollarCircle />
            <H20 className="maxSmall:!text-16 maxSmall:!font-normal">
              Pay in cash
            </H20>
          </div>
        ),
        text: (
          <H18 color="text-gray" className="maxSmall:text-16">
            {getPayInCashTextByDepositType(data, name)}
          </H18>
        ),
      }
    : null

  const payInApp =
    data.depositType !== 'OFF'
      ? {
          label: (
            <div className="flex items-center gap-4">
              <H20 className="maxSmall:!text-16 maxSmall:!font-normal">
                Deposit required
              </H20>
            </div>
          ),
          text: (
            <H18 color="text-gray" className="maxSmall:text-16">
              {getPayInAppTextByDepositType(data, name)}
            </H18>
          ),
        }
      : null

  const payInBnpl = {
    label: (
      <div className="flex items-center gap-4">
        <H20 className="maxSmall:!text-16 maxSmall:!font-normal">
          Buy now, Pay Later
        </H20>
        <img src={ImageBNPLIcons.src} className="w-16" alt="bnpl-icon" />
      </div>
    ),
    text: (
      <H18 color="text-gray" className="maxSmall:text-16">
        The {name} offers book now, pay later options{' '}
        <span className="text-black">with Afterpay, Klarna, and Affirm.</span>
      </H18>
    ),
  }

  const cancellationPolicies = {
    label: (
      <H20 className="maxSmall:!text-16 maxSmall:!font-normal">
        Cancellation policies
      </H20>
    ),
    text: (
      <CancellationPolicyText
        cancellationRule={data.cancellationRule}
        depositType={data.depositType}
        name={name}
        deposit={data.amount}
        percentOfService={data.percentOfService}
      />
    ),
  }
  return { payInCash, cancellationPolicies, payInApp, payInBnpl }
}

export const getPayInCashTextByDepositType = (
  terms: ITermsOfPayment,
  name: string
) => {
  switch (terms.depositType) {
    case 'OFF':
      return getBlackName(name, 'accepts cash payments for appointments.')
    case 'FIXED':
      return (
        <>
          <span>{name}</span> charges a{' '}
          <span>
            deposit of{' '}
            {formatPrice({ price: terms.amount, currency: terms.currency })}
          </span>{' '}
          to confirm your appointment. The remaining amount can be paid in cash
          after your service.
        </>
      )
    case 'FULL_PRICE':
      return 'To pay in cash you’ll be asked to confirm your booking via debit/credit card. This Pro charges the full booking amount after your service is completed.'
    case 'PERCENT_OF_SERVICE':
      return (
        <>
          <span>{name}</span> charges a{' '}
          <span>deposit of {terms.percentOfService}%</span> to confirm your
          appointment. The remaining amount can be paid in cash after your
          service.
        </>
      )
    default:
      return getBlackName(name, 'accepts cash payments for appointments.')
  }
}

export const getPayInAppTextByDepositType = (
  terms: ITermsOfPayment,
  name: string
) => {
  switch (terms.depositType) {
    case 'OFF':
      return (
        <>
          A non-refundable deposit is required to secure your appointment with{' '}
          <span> {name} </span>. The remaining amount will be collected after
          your service is completed.
        </>
      )
    case 'FIXED':
      return (
        <>
          {/* Book your appointment using a credit/debit card or Apple/Google Pay.
            A{' '}
            <span>
              deposit of{' '}
              {formatPrice({ price: terms.amount, currency: terms.currency })}
            </span>{' '}
            is required to secure your appointment with <span>{name}</span>. The
            remaining amount will be charged after your service is completed. */}
          A non-refundable deposit is required to secure your appointment with
          <span> {name} </span>. The remaining amount will be collected after
          your service is completed.
        </>
      )
    case 'FULL_PRICE':
      return (
        <>
          A non-refundable deposit is required to secure your appointment with
          <span> {name} </span>. The remaining amount will be collected after
          your service is completed.
        </>
      )
    case 'PERCENT_OF_SERVICE':
      return (
        <>
          <>
            {/* Book your appointment using a credit/debit card or Apple/Google Pay.
            A <span>deposit of {terms.percentOfService}%</span> is required to
            secure your appointment with <span>{name}</span>. The remaining
            amount will be charged after your service is completed. */}
            A non-refundable deposit is required to secure your appointment with
            <span> {name} </span>. The remaining amount will be collected after
            your service is completed.
          </>
        </>
      )
    default:
      return getBlackName(
        name,
        'accepts debit/credit card payments for appointments.'
      )
  }
}

export const getPayInBnplText = (name: string) => {
  return (
    <p className="w-full flex flex-wrap leading-6 align-middle  text-ellipsis float-right">
      The
      <IconEllipse width={4} />
      {name}
      <IconEllipse width={4} />
      offers
      <IconEllipse width={4} />
      book
      <IconEllipse width={4} />
      now,
      <IconEllipse width={4} />
      pay
      <IconEllipse width={4} />
      later
      <IconEllipse width={4} />
      options
      <IconEllipse width={4} />
      with
      <IconEllipse width={4} />
      <IconAfterpaySmall />
      <IconEllipse width={4} />
      Afterpay, <IconKlarnaSmall />
      <IconEllipse width={4} />
      Klarna, and
      <IconEllipse width={4} />
      <IconAffirmSmallBnpl />
      <IconEllipse width={4} />
      Affirm.
    </p>
  )
}

const getBlackName = (name: string, text: string) => (
  <span>
    <span>{name} </span>
    {text}
  </span>
)
