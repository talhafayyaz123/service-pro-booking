import { useRouter } from 'next/router'

import { Button } from '@/components/common/buttons/Button'
import {
  MobileSecondaryHeader,
  ProgressLine,
} from '@/components/header/ProSetupHeader'
import { H24 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'

export const BiHeader = () => {
  const router = useRouter()

  const onBack = () => {
    router.push(
      getUrlWithSearchParams(router.pathname, { step: 'welcome' }),
      undefined,
      { shallow: true }
    )
  }

  return (
    <div className={'z-10 flex-none'}>
      <div
        className={
          'hidden tablet:flex items-center justify-center px-20 bg-white  relative shadow-xl h-[82px]'
        }
      >
        <Button
          onClick={onBack}
          buttonType="withIcon"
          className={cn('!absolute left-20')}
        >
          Back
        </Button>
        <H24
          className={
            'font-bold maxTablet:text-16 maxTablet:leading-[22px] mx-auto'
          }
        >
          1 of 5
        </H24>
        <ProgressLine step={'basicInfo'} />
      </div>
      <MobileSecondaryHeader
        onBack={onBack}
        onNextStep={() => null}
        step={'basicInfo'}
      />
    </div>
  )
}
