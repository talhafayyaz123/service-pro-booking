import { signOut, useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useMemo } from 'react'

import { IconQrCode } from '@/assets/icons/icons'
import { BackButton } from '@/components/common/buttons/BackButton'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { QRCode } from '@/components/qrCode/QRCode'
import { MainSidebarMenu } from '@/components/sidebarMenu/MainSidebarMenu'
import { UnAuthSidebarMenu } from '@/components/sidebarMenu/UnAuthorizSidebarMenu'
import { MODALS_TYPE } from '@/core/consts/common'
import { handleSignOut } from '@/core/helpers/handleSignOut'
import { SearchHeader } from '@/features/searchHeader/SearchHeader'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

interface Props {
  sticky?: boolean
  hideOnMobile?: boolean
  showBack?: boolean
}

export const MainHeader = ({ sticky, hideOnMobile, showBack }: Props) => {
  const { t } = useTranslation('common')
  const dispatch = useAppDispatch()

  const { data, status } = useSession()
  const isAuth = useMemo(
    () => !!data?.user.accessToken,
    [data?.user.accessToken]
  )

  const session = useSession()
  useEffect(() => {
    const channel = new BroadcastChannel('auth')
    channel.onmessage = async (event) => {
      if (event.data === 'logout') {
        // handleSignOut()
        await signOut({ callbackUrl: '/' }) // Trigger sign out for the current tab
        // router.push('/')
        handleSignOut()
      }
    }

    return () => {
      channel.close()
    }
  }, [])
  return (
    <div className={'sticky top-0 z-[11] flex-none bg-white'}>
      <header
        className={`hidden tablet:flex h-[82px] overflow-x-auto ${
          sticky ? 'sticky top-0' : ''
        } gap-3 w-full bg-white shadow-base px-4 laptop:px-16 desktop:px-20 items-center justify-between`}
      >
        <div className="flex items-center flex-shrink-0 gap-9 laptop:gap-11 ">
          <LogoButton className="mr-[13px]" />
          {session.data?.user.role !== 'PRO' && <SearchHeader />}
          {/* <div className={'maxLaptop:hidden'}>
            <div
              className={
                session.data?.user.role === 'PRO'
                  ? 'opacity-0 pointer-events-none'
                  : ''
              }
            >
              <FindInspiration />
            </div>
          </div> */}
        </div>
        <div className="flex items-center justify-between gap-6">
          <div />
          <QRCode placement={'bottom'}>
            <Button
              textClassName={'flex gap-4'}
              className={'maxTablet:hidden '}
            >
              Get the app <IconQrCode className={'text-orange'} />
            </Button>
          </QRCode>
          <a
            className={'maxLargeDesktop:hidden'}
            target="_blank"
            href="https://pro.readyhubb.com/"
            rel="noreferrer"
          >
            <Button>{t('buttons.list_your_business')}</Button>
          </a>
          {status !== 'loading' ? (
            isAuth ? (
              <MainSidebarMenu />
            ) : (
              <>
                <div
                  className={
                    'flex items-center justify-between gap-6 maxLargeDesktop:hidden'
                  }
                >
                  <Button
                    onClick={() =>
                      dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_IN }))
                    }
                  >
                    {t('buttons.sign_in')}
                  </Button>
                  <Button
                    onClick={() =>
                      dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP }))
                    }
                  >
                    {t('buttons.sign_up')}
                  </Button>
                </div>
                <div className={'largeDesktop:hidden'}>
                  <UnAuthSidebarMenu />
                </div>
              </>
            )
          ) : null}
        </div>
      </header>
      <MobileMainHeader hideOnMobile={hideOnMobile} showBack={showBack} />
    </div>
  )
}

interface IMobileMainHeader {
  hideOnMobile?: boolean
  showBack?: boolean
}

const MobileMainHeader = ({ hideOnMobile, showBack }: IMobileMainHeader) => {
  const { data } = useSession()
  const isAuto = !!data?.user.accessToken
  return (
    <header
      className={`${
        hideOnMobile ? 'hidden  tablet:flex' : 'flex'
      } items-center border-b-[1.5px] border-violet justify-between px-6 tablet:hidden  h-[72px]`}
    >
      {showBack && (
        <div>
          <BackButton className={'w-fit'} />
        </div>
      )}
      <LogoButton />
      {isAuto ? <MainSidebarMenu /> : <UnAuthSidebarMenu />}
    </header>
  )
}

// const FindInspiration = () => {
//   const { t } = useTranslation('common')

//   return (
//     <Link href={ROUTES.inspiration}>
//       <a className="flex flex-shrink-0 items-start gap-2.5 cursor-pointer group">
//         <IconStart className={''} />
//         <H16 className={'group-hover:text-orange transition  !font-bold'}>
//           {t('buttons.find_inspiration')}
//         </H16>
//       </a>
//     </Link>
//   )
// }
