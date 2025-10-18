import useTranslation from 'next-translate/useTranslation'
import { useMemo } from 'react'

import { ImgDollar, ImgFire, ImgFist, ImgHart } from '@/assets/images/images'
import { CategoryIcon } from '@/components/common/CategoryCard'
import { H18, H28, H48 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const YouGet = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  const data = useMemo(() => {
    return [
      {
        icon: ImgFire.src,
        title: t('titles.discover_trends'),
        color: '#FFE2DA',
        text: t('text.discover_trends'),
      },
      {
        icon: ImgHart.src,
        title: t('titles.find_pros_you_love'),
        color: '#F9DFE6',
        text: t('text.find_pros_you_love'),
      },
      {
        icon: ImgDollar.src,
        color: '#ECF4ED',
        title: t('titles.secure_payments'),
        text: t('text.secure_payments'),
      },
      {
        icon: ImgFist.src,
        color: '#FFEBCE',
        title: t('titles.stay_updated'),
        text: t('text.stay_updated'),
      },
    ]
  }, [t])

  return (
    <div className={'container'}>
      <H48 className={'!font-bold text-center mb-[40px]'}>
        {t('titles.creating_better')}
      </H48>
      <div
        className={
          'grid maxLaptop:grid-cols-1 grid-cols-2 gap-[16px] laptop:gap-[40px] '
        }
      >
        {data.map(({ icon, color, title, text }, index) => (
          <div
            key={index}
            className={
              'p-[24px] laptop:p-[32px] shadow-xl rounded-[12px] gap-[24px] laptop:gap-[40px] flex justify-between laptop:items-center'
            }
          >
            <div className={'tablet:hidden'}>
              <CategoryIcon
                size={'56'}
                color={color}
                iconUrl={icon as string}
              />
            </div>
            <div className={'maxTablet:hidden'}>
              <CategoryIcon
                size={'80'}
                color={color}
                iconUrl={icon as string}
              />
            </div>
            <div>
              <H28 className={'maxSmall:text-[24px] maxSmall:leading-[32px]'}>
                {title}
              </H28>
              <H18
                color={'text-gray'}
                className={
                  'pt-[12px] maxSmall:text-[16px] maxSmall:leading-[24px]'
                }
              >
                {text}
              </H18>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
