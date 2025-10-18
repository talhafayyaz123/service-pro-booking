import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { memo, useCallback, useEffect } from 'react'

import {
  IconChevroLeft,
  IconMainLogo,
  IconNewClient,
  IconProfessionalNew,
  IconX,
} from '@/assets/icons/icons'
import { AccountCard } from '@/components/common/AccountCard'
import { BaseLink } from '@/components/common/links/BaseLink'
import { Modal } from '@/components/modals/Modal'
import { H14, H16, H20, H34 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import useMixpanel from '@/hooks/useMixpanel'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { MixpanelEvents } from '@/types/mixpanel'

const SignUp = memo(() => {
  const dispatch = useAppDispatch()
  const { trackEvent } = useMixpanel()
  const router = useRouter()
  const { currentModal } = useAppSelector(modalsSelector)
  const { t } = useTranslation('common')
  const { isSmall } = useMediaScreen()

  const isBookingPage = router.pathname === '/booking/[proId]'

  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  const handleNavigation = (
    type: 'onboarding_client' | 'onboarding_professional'
  ) => {
    onClose()
    router.push({
      pathname: ROUTES[type],
      query: isBookingPage ? { from: router.asPath } : {},
    })
    trackEvent(
      type === 'onboarding_client'
        ? MixpanelEvents.pages.onboarding.Client_Role_Selected
        : MixpanelEvents.pages.onboarding.Professional_Role_Selected
    )
  }

  const fetchUserId = async () => {
    trackEvent(MixpanelEvents.pages.onboarding.WELCOME_SCREEN_WEB)
  }

  useEffect(() => {
    fetchUserId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      noHeader
      onClose={onClose}
      maxWidth={isSmall ? 700 : 503}
      isOpen={currentModal === MODALS_TYPE.SIGN_UP}
      className="tablet:max-h-[90dvh] h-full small:h-max small:rounded-3xl overflow-y-auto flex flex-col justify-start items-start relative"
      space="px-0 py-0"
    >
      <div className="w-full flex justify-center items-center mb-6 sticky top-0 bg-white pt-8 pb-5 px-8">
        <IconChevroLeft
          onClick={onClose}
          className="absolute left-0 w-5 h-5 cursor-pointer small:hidden block ml-4"
        />

        <IconMainLogo className="w-6 h-6" />

        <IconX
          onClick={onClose}
          className="absolute right-0 cursor-pointer w-5 h-5 hidden small:block mr-8"
        />
      </div>
      <div
        className={
          'w-full small:h-auto h-full flex flex-col text-center pb-8 px-8'
        }
      >
        <div className={'mb-6'}>
          <H34 className={'!font-bold'}>
            {t('text.welcome_to')} <br />
            <span className={'text-orange'}>Readyhubb!</span>
          </H34>
        </div>

        <div className={'flex flex-col'}>
          <H20 color={'text-gray'} className={'!font-normal tracking-[-0.2px]'}>
            Let's get started!
          </H20>
          <H20 color={'text-gray'} className={'!font-normal tracking-[-0.2px]'}>
            {t('text.account_type')}
          </H20>
        </div>

        <div className={'flex flex-col h-full'}>
          <div className={'flex flex-col gap-3 mt-6 mb-6 flex-grow'}>
            <AccountCard
              icon={
                <div
                  className={
                    'bg-yellow flex items-center justify-center rounded-full w-full h-full p-2.5'
                  }
                >
                  <IconNewClient width={26} height={26} />
                </div>
              }
              onClick={() => handleNavigation('onboarding_client')}
              title={t('text.client_account')}
              text={<H14 font="font-sofiaprolight ">{client}</H14>}
            />
            <AccountCard
              onClick={() => handleNavigation('onboarding_professional')}
              icon={
                <div
                  className={
                    'bg-violet flex items-center justify-center rounded-full w-full h-full p-2.5'
                  }
                >
                  <IconProfessionalNew width={28} height={28} />
                </div>
              }
              title={t('text.professional_account')}
              text={<H14 font="font-sofiaprolight">{pro}</H14>}
            />
          </div>

          <div className={'h-[68px] flex items-end justify-center gap-2'}>
            <H16 color={'text-gray'} className={'inline '}>
              {t('text.already_have_account')}
            </H16>{' '}
            <BaseLink
              line={false}
              linkType={'orange'}
              type={'button'}
              size={'200'}
              onClick={() =>
                dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_IN }))
              }
            >
              {' '}
              {t('buttons.sign_In')}
            </BaseLink>
          </div>
        </div>
      </div>
    </Modal>
  )
})

const client = 'Find local pros, explore styles, and book with confidence.'

const pro = 'Reach more clients and manage your business'

export default SignUp
