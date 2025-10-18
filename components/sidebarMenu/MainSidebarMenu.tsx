import Tippy from '@tippyjs/react'
import { signOut, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'

import { IconBooking, IconFavorit, IconUser } from '@/assets/icons/icons'
import { ListItem, SidebarMenuButton } from '@/components/sidebarMenu/MenuItem'
import {
  IListItemProps,
  useSedibarMenuHelper,
} from '@/components/sidebarMenu/useSedibarMenuHelper'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { handleSignOut } from '@/core/helpers/handleSignOut'
import { removeDoubleSlashes } from '@/core/helpers/removeDoubleSlashes'
import { clear } from '@/features/searchHeader/store/searchHeaderSlice'
// import useBroadcastLogout from '@/features/userProfile/hooks/useBroadcastLogout'
// import useSyncLogout from '@/features/userProfile/hooks/useLogoutHook'
import { useAppDispatch } from '@/hooks/hooks'

export const MainSidebarMenu = () => {
  const { data } = useSession()
  const dispatch = useAppDispatch()

  const role = data?.user.role
  const { handleControlClick, showDropdown, popperOptions, handleClose } =
    useSedibarMenuHelper()

  const handleLogout = async () => {
    const channel = new BroadcastChannel('auth')
    channel.postMessage('logout') // Notify other tabs

    try {
      const res = await signOut({
        callbackUrl: '/',
      }) // Log out from the current tab
      handleSignOut()
      // eslint-disable-next-line no-console
      console.log('SUCCESS logout ', res)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('ERR logout', error)
    }
  }

  // const { handleLogout } = useSyncLogout()
  // const { handleLogout } = useBroadcastLogout()
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const mainList: IListItemProps[] = useMemo(() => {
    const items =
      role === 'CLIENT'
        ? [
            {
              icon: <IconBooking />,
              label: t('menu.booking'),
              link: removeDoubleSlashes(
                `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.bookings}`
              ),
            },
            {
              icon: <IconFavorit />,
              label: t('menu.favorites'),
              link: removeDoubleSlashes(
                `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.favorites}`
              ),
            },
          ]
        : []

    return [
      ...items,
      {
        icon: <IconUser />,
        label: t('menu.my_profile'),
        link: removeDoubleSlashes(
          `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.myProfile}`
        ),
      },
    ]
  }, [t, role])

  const footerList: IListItemProps[] = useMemo(
    () => [
      {
        label: t('menu.log_out'),
        action: () => {
          handleLogout()
          dispatch(clear())
          // helper function that consists of all functions that are should be called while signing out
        },
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
          className="bg-white flex flex-col gap-[14px] pl-6 pt-5 pr-[50px] pb-4 rounded-2xl shadow-xl"
          {...attrs}
        >
          {mainList.map((listItem, index) => (
            <ListItem sideEffect={handleClose} key={index} {...listItem} />
          ))}
          <div className={'pt-3  border-t border-lightGray'}>
            {footerList.map((listItem, index) => (
              <ListItem
                footerItemClassName={'!text-gray'}
                sideEffect={handleClose}
                key={index}
                {...listItem}
              />
            ))}
          </div>
        </div>
      )}
    >
      <div
        role="button"
        className="flex-shrink-0 cursor-pointer select-none"
        onClick={handleControlClick}
      >
        <SidebarMenuButton open={showDropdown} />
      </div>
    </Tippy>
  )
}
