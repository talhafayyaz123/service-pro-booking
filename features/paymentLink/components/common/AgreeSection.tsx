import { memo } from 'react'

import { Checkbox } from '@/components/common/Checkbox'
import { Drawer } from '@/components/common/drawer/Drawer'
import TermsAndConditionsClient from '@/components/TermsAndConditionsClient'
import { H24 } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { TUseBaseInfo } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'

export const AgreeSection = memo(
  (
    props: Pick<
      TUseBaseInfo,
      'isOpenDrawer' | 'setIsOpenDrawer' | 'isAgree' | 'handleClickAgree'
    > & {
      className?: string
    }
  ) => {
    const {
      isOpenDrawer,
      setIsOpenDrawer,
      isAgree,
      handleClickAgree,
      className,
    } = props

    return (
      <>
        <Checkbox
          omitRole={true}
          data-testid={'agreeSection-checkbox'}
          className={cn('mt-6 mb-16 mx-5', className)}
          checked={isAgree}
          onChange={handleClickAgree}
          rightLabel={
            <span>
              I agree with{' '}
              <button
                data-testid={'terms-and-conditions'}
                onClick={(e) => {
                  e.stopPropagation()
                  setIsOpenDrawer(true)
                }}
                className={'text-orange inline'}
              >
                Terms and Conditions
              </button>
            </span>
          }
        />
        <Drawer
          status={'loaded'}
          isOpen={isOpenDrawer}
          className="maxSmall:w-full"
          header={<H24>Terms and Conditions</H24>}
          headerClassName="px-4 small:px-10"
          onClose={() => setIsOpenDrawer(false)}
        >
          <div className="px-4 small:px-10 mt-14 mb-[84px]">
            <TermsAndConditionsClient />
          </div>
        </Drawer>
      </>
    )
  }
)
