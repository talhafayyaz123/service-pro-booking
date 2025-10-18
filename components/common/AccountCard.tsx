import { ReactNode } from 'react'

import { IconOrangeRightChevron } from '@/assets/icons/icons'
import { H14, H16 } from '@/components/typography'

export const AccountCard = ({
  onClick,
  title,
  text,
  icon,
}: {
  onClick?: () => void
  title: string
  text: string | ReactNode
  icon?: ReactNode
}) => {
  return (
    <div
      role={'button'}
      onClick={onClick}
      className={
        'flex items-center justify-between rounded-xl bg-white shadow-xl p-4.5 pb-4 small:pb-6 gap-4 small:gap-[22px] cursor-pointer'
      }
    >
      <div
        className={
          'w-12 h-12  small:w-[52px]  small:h-[52px] shadow-xs bg-white rounded-full p-[3px] overflow-hidden shrink-0'
        }
      >
        {icon}
      </div>
      <div className={'text-start flex-1 flex flex-col justify-between '}>
        <div className={'flex items-start justify-between font-medium'}>
          <H16 font="font-sofiapro" className={'!font-bold'}>
            {title}
          </H16>
        </div>

        <H14 font="font-sofiaprolight">{text}</H14>
      </div>

      <IconOrangeRightChevron />
    </div>
  )
}
