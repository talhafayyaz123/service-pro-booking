import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'

import { IconArrow } from '@/assets/icons/icons'
import { ImgEllipses, ImgWelcome, ImgWelcomeIpad } from '@/assets/images/images'
import { Button } from '@/components/common/buttons/Button'
import { H18, H40 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { steps } from '@/features/accountSetup/helpers/steps'
import { useAppDispatch } from '@/hooks/hooks'
import useMixpanel from '@/hooks/useMixpanel'
import { meRequest } from '@/store/me/meRequests'
import { MixpanelEvents } from '@/types/mixpanel'
import { IWelcomeProps } from '@/types/onboarding'

const Welcome = ({
  onNextStep,
  onBack,
  type,
}: Omit<IWelcomeProps, 'step' | 'trialDays'>) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(meRequest())
  }, [dispatch])

  return (
    <>
      <WelcomeMobile type={type} onBack={onBack} onNextStep={onNextStep} />
      <div
        style={{
          backgroundImage: `url(${ImgEllipses.src})`,
          backgroundPositionY: 'center',
        }}
        className={`flex bg-cover bg-no-repeat bg-[433px_center] items-center  relative justify-center maxTablet:hidden my-auto h-full overflow-hidden w-full gap-x-2.5`}
      >
        <div className="flex-shrink-0 flex z-[1] desktop:ml-auto">
          <ClientCard onNextStep={onNextStep} />
        </div>
        <div className="ml-auto hidden z-[1] tab desktop:block">
          <img
            className="max-h-[74vh] object-cover"
            alt="ipad screenshot"
            src={ImgWelcomeIpad.src}
          />
        </div>
      </div>
    </>
  )
}

const WelcomeMobile = ({
  onBack,
  onNextStep,
  type,
}: Omit<IWelcomeProps, 'step' | 'trialDays'>) => {
  return (
    <div className="flex flex-col justify-start h-full overflow-y-auto tablet:hidden bg-yellow">
      {type !== steps.welcome && (
        <IconArrow
          onClick={onBack}
          className="mx-5 mt-[30px] cursor-pointer flex-shrink-0 w-6 h-6 stroke-black"
        />
      )}

      <div
        className={`px-10 w-full flex place-content-center absolute ${
          type === steps.welcome ? 'top-[86px]' : 'top-[50px]'
        } `}
      >
        <img src={ImgWelcome.src} alt="iPhone screenshot" />
      </div>
      <ClientCard onNextStep={onNextStep} />
    </div>
  )
}

const ClientCard = ({ onNextStep }: Pick<IWelcomeProps, 'onNextStep'>) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { t: tCommon } = useTranslation(TRANSLATE_KEYS.common)
  const { trackEvent } = useMixpanel()
  return (
    <div className="z-10 mt-auto max-h-[80dvh]]">
      <div className="bg-white maxTablet:rounded-t-[20px] tablet:rounded-[20px] tablet:ml-5 maxTablet:shadow-yellow shadow-xl  maxTablet:text-center tablet:max-w-[620px] ">
        <div className="flex flex-col gap-5 maxTablet:pt-8 maxTablet:pb-6 py-[60px] px-[50px]">
          <H40 className="font-sofiabold">{t('titles.welcome_to_pro')}</H40>
          <H18 color={'text-gray'} className={'font-sofiaprolight'}>
            {t('text.quick_steps')}
          </H18>
          <Button
            onClick={() => {
              trackEvent(MixpanelEvents.pages.onboarding.ONBOARDING_INITIATED)
              onNextStep()
            }}
            className={'px-8 w-fit maxTablet:hidden ml-auto'}
            buttonType={'orange'}
            size={'200'}
          >
            {tCommon('buttons.get_started')}!
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Welcome
