import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'

import { IconArrow } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

interface Props {
  withBackButton?: boolean
}

export const SimpleHeader = ({ withBackButton = true }: Props) => {
  const router = useRouter()
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  const onBack = () => {
    router.back()
  }

  return (
    <div className="flex items-center min-h-[72px] justify-between small:px-20 px-6 py-5 bg-white h-full relative shadow-xl">
      {withBackButton ? (
        <>
          <Button
            onClick={onBack}
            size="42"
            className="!border-lightGray !border small:block hidden"
            buttonType={'withIcon'}
          >
            {t('buttons.back')}
          </Button>
          <IconArrow
            onClick={onBack}
            className="w-6 h-6 small:hidden stroke-black"
          />
        </>
      ) : null}
      <div className="absolute left-1/2 -translate-x-1/2">
        <LogoButton />
      </div>
    </div>
  )
}
