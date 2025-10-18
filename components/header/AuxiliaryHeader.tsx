import { useSession } from 'next-auth/react'

import { BackButton } from '@/components/common/buttons/BackButton'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { MainSidebarMenu } from '@/components/sidebarMenu/MainSidebarMenu'

export const AuxiliaryHeader = ({
  onBack,
  alternativeClassName,
}: {
  onBack?: () => void
  alternativeClassName?: string
}) => {
  const { data } = useSession()

  return (
    <header
      className={
        alternativeClassName ??
        'px-5 tablet:px-20 bg-white flex justify-between items-center shadow-xl h-[72px] small:h-[82px] z-[1]'
      }
    >
      <div>
        <BackButton className={'tablet:hidden'} onBack={onBack} />
        <Button
          size={'42'}
          className={'!px-3 !border !border-lightGray maxTablet:hidden'}
          buttonType={'withIcon'}
          onClick={onBack}
        >
          Back
        </Button>
      </div>
      <LogoButton className={' '} />
      {data?.user ? <MainSidebarMenu /> : <div />}
    </header>
  )
}
