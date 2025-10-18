import { useRouter } from 'next/router'

import { IconBack } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H16 } from '@/components/typography'

export const BackButton = ({
  className,
  withIcon = true,
  onBack,
}: {
  className?: string
  withIcon?: boolean
  onBack?: () => void
}) => {
  const router = useRouter()
  const redirectFrom = String(router.query?.redirectFrom || '/search')

  const onClick = () => {
    if (onBack) {
      return onBack()
    } else if (redirectFrom) {
      return router.replace(redirectFrom || '')
    } else {
      return router.back()
    }
  }
  return (
    <CardWrapper
      onClick={onClick}
      className={`flex justify-center cursor-pointer items-center gap-[1px] maxSmall:!p-[9px] !py-[8px] pl-[8px] pr-[16px] flex-1 hover:!bg-lightGray transition rounded-full ${className}`}
    >
      {withIcon && (
        <div className={'p-[3px] small:mt-[-2px]'}>
          <IconBack className={''} />
        </div>
      )}
      <H16 className={'hidden small:inline'}>Back</H16>
    </CardWrapper>
  )
}
