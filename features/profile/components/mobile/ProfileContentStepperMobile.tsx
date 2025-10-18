import Link from 'next/link'
import { memo } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { Stepper } from '@/components/common/steppers/Stepper'
import { useModalData } from '@/components/modals/Modal'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { ProfileInfoMobile } from '@/features/profile/components/mobile/ProfileInfoMobile'
import { useProfileSteps } from '@/features/profile/hooks/useProfileSteps'

interface Props {
  proId: string
}

export const ProfileContentStepperMobile = memo(({ proId }: Props) => {
  const { tabs, currentTab } = useProfileSteps()
  const { isOpen } = useModalData(MODALS_TYPE.SHARE_SOCIAL_BOTTOMSHEET)

  return (
    <div>
      <Stepper
        contentTop={<ProfileInfoMobile />}
        className="relative small:hidden pb-28"
        currentTab={currentTab}
        stepsClassName="mt-6 justify-around"
        fullRender={false}
        wrapperClassName="container rounded-[20px] shadow-xl bg-white"
        labelClassName="!text-14 !leading-[18px] mb-2"
        tabs={tabs}
      />
      {!isOpen && (
        <CardWrapper className="fixed w-full z-[999] bottom-0  mt-6 rounded-b-none shadow-xl small:hidden !p-0 !pb-safe">
          <div data-test-id={'footer'} className="px-5 py-6">
            <Link href={`${ROUTES.booking(proId)}`}>
              <a>
                <Button buttonType="orange" className="w-full">
                  Book
                </Button>
              </a>
            </Link>
          </div>
        </CardWrapper>
      )}
    </div>
  )
})
