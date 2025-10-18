import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'

import { IconArrow } from '@/assets/icons/icons'
import { ImgEllipses, ImgTrial, ImgWelcomeIpad } from '@/assets/images/images'
import { Button } from '@/components/common/buttons/Button'
import { H18, H40, OrangeBlock } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch } from '@/hooks/hooks'
import useMixpanel from '@/hooks/useMixpanel'
import { meRequest } from '@/store/me/meRequests'
import { MixpanelEvents } from '@/types/mixpanel'
import { IWelcomeProps } from '@/types/onboarding'

const Trial = ({
  onNextStep,
  onBack,
}: Pick<IWelcomeProps, 'onBack' | 'onNextStep'>) => {
  const dispatch = useAppDispatch()
  const { trackEvent } = useMixpanel()
  useEffect(() => {
    dispatch(meRequest())
  }, [dispatch])

  useEffect(() => {
    trackEvent(MixpanelEvents.pages.onboarding.BUSINESS_LISTED)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <WelcomeMobile onBack={onBack} onNextStep={onNextStep} />
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
}: Pick<IWelcomeProps, 'onBack' | 'onNextStep'>) => {
  return (
    <div className="flex flex-col justify-start h-full overflow-y-auto tablet:hidden bg-yellow">
      <IconArrow
        onClick={onBack}
        className="mx-5 mt-[30px] cursor-pointer flex-shrink-0 w-6 h-6 stroke-black"
      />

      <div className="px-10 w-full flex place-content-center absolute top-[50px]">
        <img src={ImgTrial.src} alt="iPhone trial screenshot" />
      </div>
      <ClientCard onNextStep={onNextStep} />
    </div>
  )
}

const ClientCard = ({ onNextStep }: Pick<IWelcomeProps, 'onNextStep'>) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { t: tCommon } = useTranslation(TRANSLATE_KEYS.common)

  return (
    <div className="z-10 mt-auto max-h-[80dvh]">
      <div className="bg-white maxTablet:shadow-yellow shadow-xl flex flex-col mx-auto gap-6 px-5 pt-8 pb-6 small:p-[34px] desktop:p-[60px] w-full  tablet:max-w-[620px] maxTablet:rounded-b-none rounded-[20px]">
        <H40 className="font-sofiabold text-center lg:text-left">
          {t('titles.trial_title')}
        </H40>
        <H18
          color="text-gray"
          className="text-center font-sofiaprolight -mt-2 lg:text-left"
        >
          {t('text.trial_text')}
        </H18>

        <OrangeBlock>{t('text.note_trial_text')}</OrangeBlock>
        <Button
          onClick={onNextStep}
          className="px-8 maxSmall:-mt-1 w-fit maxTablet:hidden lg:ml-auto"
          buttonType="orange"
          size="200"
        >
          {tCommon('buttons.get_started')}
        </Button>
      </div>
    </div>
  )
}

export default Trial
