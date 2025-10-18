import Tippy from '@tippyjs/react'
import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'

import { IconBurgerMenu } from '@/assets/icons/icons'
import { ListItem } from '@/components/sidebarMenu/MenuItem'
import {
  IListItemProps,
  useSedibarMenuHelper,
} from '@/components/sidebarMenu/useSedibarMenuHelper'
import { MODALS_TYPE } from '@/core/consts/common'
// import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const UnAuthSidebarMenu = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const dispatch = useAppDispatch()

  const { handleControlClick, showDropdown, popperOptions, handleClose } =
    useSedibarMenuHelper()
  const mainList: IListItemProps[] = useMemo(
    () => [
      // {
      //   label: t('buttons.find_inspiration'),
      //   link: `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.inspiration}`,
      // },
      {
        label: t('buttons.list_your_business'),
        link: 'https://pro.readyhubb.com/',
      },
      {
        label: t('buttons.sign_in'),
        action: () => dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_IN })),
      },
      {
        label: t('buttons.sign_up'),
        action: () => dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP })),
      },
    ],
    [dispatch, t]
  )
  return (
    <Tippy
      {...popperOptions}
      visible={showDropdown}
      render={(attrs) => (
        <div
          className={
            'bg-white flex flex-col gap-[14px] pl-[24px] pt-[20px] pr-[50px] pb-[16px] rounded-[16px] shadow-xl'
          }
          {...attrs}
        >
          {mainList.map((listItem, index) => (
            <ListItem sideEffect={handleClose} key={index} {...listItem} />
          ))}
        </div>
      )}
    >
      <div>
        {' '}
        <IconBurgerMenu
          onClick={handleControlClick}
          className={'cursor-pointer'}
        />
      </div>
    </Tippy>
  )
}
