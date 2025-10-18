import useTranslation from 'next-translate/useTranslation'

import { IconArrowLeft } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { OnlyLogoButton } from '@/components/common/buttons/LogoButton'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const SecondaryHeader = ({ onBack }: { onBack?: () => void }) => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  return (
    <div className="h-[72px] w-full sticky top-0 flex items-center justify-center bg-white small:px-20 px-6 z-50">
      <Button
        className="!absolute left-20 small:block hidden"
        onClick={onBack}
        buttonType={'withIcon'}
      >
        {t('buttons.back')}
      </Button>
      <IconArrowLeft
        role="button"
        onClick={onBack}
        className="absolute left-0 translate-x-full small:hidden stroke-black"
      />

      <OnlyLogoButton />
    </div>
  )
}
