import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

import { ImgInspirePhoto } from '@/assets/images/images'
import { H18, H38, H80 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const InspirationTop = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  return (
    <div
      className={
        'maxSmall:bg-white overflow-hidden  bg-violet pt-4 small:pb-[24px] tablet:pb-0 small:pt-[26px] '
      }
    >
      <div
        className={
          'container flex tablet:gap-x-[40px] desktop:gap-x-[263px] justify-between  items-center'
        }
      >
        <div className={'max-w-[397px] maxSmall:hidden'}>
          <H80>{t('titles.find_your_inspiration')}</H80>
          <H18 color={'text-gray'} className={'mt-[24px]'}>
            {t('text.beauty_trends')}
          </H18>
        </div>
        <H38 className={'small:hidden'}>{t('titles.inspire')}</H38>
        <div
          className={
            'desktop:mr-[200px] flex items-end maxTablet:hidden flex-shrink-0'
          }
        >
          <Image
            src={ImgInspirePhoto.src}
            objectFit={'cover'}
            height={430}
            width={380}
            alt="main"
          />
        </div>
      </div>
    </div>
  )
}
