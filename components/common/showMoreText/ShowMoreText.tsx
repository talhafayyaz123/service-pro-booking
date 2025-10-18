import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { ReactShowMoreTextProps } from 'react-show-more-text'

import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

const ShowMoreText = dynamic(() => import('react-show-more-text'), {
  ssr: false,
})

export const ShowMore = ({ ...props }: ReactShowMoreTextProps) => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  return (
    <ShowMoreText
      lines={3}
      more={
        <span className="text-orange hover:text-orange1 transition">
          {t('buttons.read_more')}
        </span>
      }
      less={
        <span className="text-orange hover:text-orange1 transition">
          {t('buttons.show_less')}
        </span>
      }
      className="text-16 leading-[22px] mt-3"
      expanded={false}
      width={0}
      {...props}
    >
      {props.children}
    </ShowMoreText>
  )
}
