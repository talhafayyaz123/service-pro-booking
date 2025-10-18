import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { Fragment } from 'react'

import {
  IconAffirm,
  IconAfterpay,
  IconKlarna,
  IconLogo,
  IconX,
} from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { H24, H64 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { cn } from '@/core/helpers/cn'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'

export const BNPL = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const query = getQueriesForSearchRedirect()
  const router = useRouter()

  const handleBookNow = () => {
    router.push({
      pathname: ROUTES.search,
      // query: { ...query, payInBnpl: true },
      query: { ...query },
    })
  }

  return (
    <div className="w-full h-full flex flex-row justify-start items-start rounded-20 container p-0 overflow-hidden relative mt-6 maxSmall:mb-6 mb-10 tablet:mb-20 tablet:mt-20">
      <div className="pl-12 maxSmall:pl-4 w-full h-full flex flex-col justify-start items-start pt-5 pb-2 tablet:pt-10 tablet:pb-6 desktop:py-10 bg-pink gap-4 tablet:gap-6">
        <span className="flex max-[375px]:w-1/2 maxSmall:w-3/5 w-3/4 laptop:w-max relative z-10">
          <H64 className="text-balance max-[375px]:text-24 font-sofiasemi tablet:leading-[3.5rem]">
            {t('text.slay_now')}
            {', '}
            <span className="text-orange">{t('text.pay_later')}</span>
          </H64>
        </span>
        <H24 className="font-sofiaprolight z-10 max-[375px]:w-1/2 maxSmall:w-3/5 w-[45%] desktop:w-[48%] -mt-2 maxLaptop:hidden">
          {t('text.bnpl_banner_text')}
        </H24>
        <Button
          buttonType="3d"
          onClick={handleBookNow}
          textClassName="text-[11px] small:text-14 tablet:text-18"
          className="maxTablet:border-none maxTablet:shadow-none maxTablet:py-3 maxTablet:h-10 relative z-10"
        >
          {t('buttons.book_now')}
        </Button>
        <div className="w-full flex laptop:hidden flex-row flex-wrap justify-start items-center gap-[6px] tablet:gap-4 box-border mt-1 tablet:mt-3 relative z-10">
          {payments.map((item, index) => (
            <Fragment key={`${index}-${item.color}`}>
              <span
                className={cn(
                  'rounded-[4px] tablet:rounded-lg box-border',
                  item.color,
                  item.padding
                )}
              >
                {item.icon}
              </span>
              <IconX className="w-1 tablet:w-3 last:hidden" />
            </Fragment>
          ))}
        </div>

        {/* bnpl payment options desktop  */}

        <span
          className={cn(
            'rounded-[4px] tablet:rounded-lg box-border absolute right-[42%] desktop:right-[38%] z-20 maxLaptop:hidden top-[48%] desktop:top-[135px]',
            payments[1].color,
            payments[1].padding
          )}
        >
          {payments[1].icon}
        </span>

        <span
          className={cn(
            'rounded-[4px] tablet:rounded-lg box-border absolute right-14 desktop:right-[150px] z-20 maxLaptop:hidden top-[35%] desktop:top-[32%]',
            payments[2].color,
            payments[2].padding
          )}
        >
          {payments[2].icon}
        </span>

        <span
          className={cn(
            'rounded-[4px] tablet:rounded-lg box-border absolute right-8 desktop:right-[40px] z-20 maxLaptop:hidden top-2/3 desktop:top-[178px]',
            payments[3].color,
            payments[3].padding
          )}
        >
          {payments[3].icon}
        </span>
      </div>
      <div className="w-[120px] desktop:w-[479px] desktop:h-[550px] tablet:w-60 laptop:w-80 h-full maxSmall:rounded-l-[30%] small:rounded-l-full laptop:rounded-l-[22%] desktop:rounded-full flex shrink absolute -right-5 small:right-0 desktop:-right-[82px] desktop:-top-1/2 bg-orange" />
      <img
        src="/assets/bnpl-mobile.png"
        alt="BNPL"
        className="h-full tablet:hidden -bottom-1 absolute z-0 -right-1 small:right-5 object-cover"
      />
      <img
        src="/assets/bnpl-desktop.png"
        alt="BNPL"
        className="h-full maxTablet:hidden absolute z-0 tablet:-right-10 laptop:right-[110px] desktop:right-48 object-cover"
      />
    </div>
  )
}

const payments = [
  {
    name: 'Readyhub',
    icon: (
      <IconLogo
        className={cn(`max-[375px]:h-2.5 maxSmall:h-3 h-2.5 tablet:h-5`)}
      />
    ),
    color: '',
    padding: 'pt-0.5 small:pt-1',
  },
  {
    name: 'Klarna',
    icon: <IconKlarna className={cn(`h-[7px] tablet:h-4`)} />,
    color: 'bg-pink-dark',
    padding: 'px-1.5 tablet:px-4 py-1 tablet:py-2.5',
  },
  {
    name: 'Afterpay',
    icon: <IconAfterpay className={cn(`h-[8.7px] tablet:h-5`)} />,
    color: 'bg-green',
    padding: 'px-1.5 tablet:px-4 py-1 tablet:py-2',
  },
  {
    name: 'Affirm',
    icon: <IconAffirm className={cn(`h-3 tablet:h-6`)} />,
    color: 'bg-white',
    padding: 'px-1.5 tablet:px-4 py-0.5 tablet:py-1.5',
  },
]
