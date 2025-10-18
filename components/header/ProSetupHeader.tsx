import useTranslation from 'next-translate/useTranslation'

import { IconArrow } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { H24 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { cn } from '@/core/helpers/cn'
import {
  stepNumbers,
  steps,
  TSteps,
} from '@/features/accountSetup/helpers/steps'
import { IOnboardingProps } from '@/types/onboarding'

const arr: TSteps[] = [steps.welcome, steps.trial]

export const ProSetupHeader = ({
  onBack,
  step,
  onNextStep,
}: Omit<IOnboardingProps, 'type' | 'percentage'>) => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  return (
    <div className={'z-10'}>
      <div
        className={
          'hidden tablet:flex items-center justify-center px-20 bg-white h-full relative shadow-xl'
        }
      >
        {step !== 'welcome' && (
          <Button
            onClick={onBack}
            buttonType="withIcon"
            className={cn('!absolute left-20')}
          >
            {t('buttons.back')}
          </Button>
        )}
        <HeaderTitle step={step} />
        <ProgressLine step={step} />
      </div>
      <MobileSecondaryHeader
        onBack={onBack}
        onNextStep={onNextStep}
        step={step}
      />
    </div>
  )
}

export const MobileSecondaryHeader = ({
  step,
  onBack,
}: Omit<IOnboardingProps, 'type' | 'percentage'>) => {
  return (
    <div>
      {arr.includes(step) ? (
        <div />
      ) : (
        <header
          className={`tablet:hidden relative h-[72px] bg-white flex items-center z-20 justify-between px-5 shadow-xl`}
        >
          <Button buttonType="link" onClick={onBack}>
            <IconArrow className="w-6 h-6 stroke-black" />
          </Button>

          <HeaderTitle step={step} />
          <ProgressLine step={step} />
        </header>
      )}
    </div>
  )
}

const HeaderTitle = ({ step }: { step: TSteps }) => {
  // const { t } = useTranslation(TRANSLATE_KEYS.common)
  return (
    <>
      {!arr.includes(step) ? (
        <H24
          className={
            'font-bold maxTablet:text-16 maxTablet:leading-[22px] mx-auto'
          }
        >
          {stepNumbers[step]} of 5
        </H24>
      ) : (
        <LogoButton />
      )}

      {/* {[3, 7, 10].includes(step) ? (
        <>
          <Button
            size={'50'}
            buttonType={'withIcon'}
            onClick={onNextStep}
            className={'cursor-pointer maxTablet:hidden'}
          >
            {t('buttons.skip')}
          </Button>
          <H16
            color={'text-gray'}
            className={'cursor-pointer tablet:hidden'}
            onClick={onNextStep}
          >
            {t('buttons.skip')}
          </H16>
        </>
      ) : (
        <div className={'w-10 h-10'} />
      )} */}
    </>
  )
}

export const ProgressLine = ({ step }: { step: TSteps }) => {
  return (
    <>
      <div
        className={cn(
          width[stepNumbers[step]],
          'h-0.5 left-0 bg-orange absolute bottom-0 z-[2]'
        )}
      />
      <div
        className={
          'h-0.5 tablet:hidden left-0 bg-yellow absolute bottom-0 z-[1] w-full'
        }
      />
    </>
  )
}
const width: Record<number, string> = {
  1: 'w-[10%]',
  2: 'w-[25%]',
  3: 'w-[50%]',
  4: 'w-[65%]',
  5: 'w-[80%]',
}
