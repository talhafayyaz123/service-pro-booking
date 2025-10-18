import useTranslation from 'next-translate/useTranslation'
import { ReactNode } from 'react'

import { H14 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

interface IProps {
  className?: string
  textClassName?: string
  text?: ReactNode
}

export const OrBorder = ({ className, textClassName, text }: IProps) => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  return (
    <div className={` flex items-center justify-center gap-4 ${className}`}>
      <div className={'h-px w-full bg-lightGray'} />
      <H14 className={`font-medium ${textClassName} `}>
        {' '}
        {text || t('text.or')}
      </H14>
      <div className={'h-px w-full bg-lightGray'} />
    </div>
  )
}
