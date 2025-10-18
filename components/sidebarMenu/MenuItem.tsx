import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { memo, useMemo } from 'react'

import { IconClose } from '@/assets/icons/icons'
import { ImgProUser, ImgUser } from '@/assets/images/images'
import { IListItemProps } from '@/components/sidebarMenu/useSedibarMenuHelper'
import { H16 } from '@/components/typography'
import { removeDoubleSlashes } from '@/core/helpers/removeDoubleSlashes'
import { useAppSelector } from '@/hooks/hooks'

export const ListItem = memo(
  ({
    icon,
    label,
    footerItemClassName,
    sideEffect,
    link,
    action,
  }: IListItemProps) => {
    const classNames = `group ${
      icon ? 'grid grid-cols-[24px_1fr]' : ''
    } gap-4 transition justify-start items-center w-max`
    const content = (
      <>
        {icon && <div className="flex items-center justify-center">{icon}</div>}
        <H16
          className={`group-hover:!text-orange transition cursor-pointer whitespace-nowrap ${footerItemClassName}`}
        >
          {label}
        </H16>
      </>
    )
    const onClick = () => {
      sideEffect && sideEffect()
      action && action()
    }

    return link ? (
      <Link href={removeDoubleSlashes(link)}>
        <a className={`${classNames}`} role="button" onClick={onClick}>
          {content}
        </a>
      </Link>
    ) : (
      <div className={`${classNames}`} role="button" onClick={onClick}>
        {content}
      </div>
    )
  }
)

export const SidebarMenuButton = memo(({ open }: { open: boolean }) => {
  const { iconUrl } = useAppSelector((state) => state.me.me)
  const role = useSession().data?.user.role
  const isPro = useMemo(() => role === 'PRO' + '', [role])
  return (
    <div
      className={
        'flex items-center gap-[10px] border border-lightGray rounded-[12px] bg-white p-1'
      }
    >
      <div className={'w-[15px] ml-[10px]'}>
        {open ? <IconClose className={'stroke-[#939DAA]'} /> : <MenuIcon />}
      </div>

      {iconUrl ? (
        <img
          className={'w-[34px] rounded-[8px] h-[34px] object-cover'}
          src={iconUrl}
          alt="icon"
        />
      ) : (
        <img
          className={`w-[34px] p-[8px] ${
            isPro ? 'bg-[#EDDFFF]' : 'bg-pink'
          } rounded-[8px] h-[34px] object-cover`}
          src={isPro ? ImgProUser.src : ImgUser.src}
          alt="icon"
        />
      )}
    </div>
  )
})

export const MenuIcon = () => {
  return (
    <div className={'flex flex-col gap-[5px] w-[15px]'}>
      <div className={'h-[1px] w-full bg-gray rounded-full'} />
      <div className={'h-[1px] w-full bg-gray rounded-full'} />
      <div className={'h-[1px] w-full bg-gray rounded-full'} />
    </div>
  )
}
