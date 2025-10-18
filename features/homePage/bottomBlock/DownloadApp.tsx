import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

import { ImgMobile } from '@/assets/images/images'
import { ApplePayLink } from '@/components/common/ApplePayLink'
import { GooglePlayLink } from '@/components/common/GooglePlayLink'
import { H18, H48 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const DownloadApp = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  return (
    <div className="grid laptop:grid-cols-2 mb-20 gap-y-10 laptop:mb-[120px]">
      <div className="relative mr-5">
        <div className="bg-violet w-full hidden largeDesktop:block  h-[489px] bottom-[73px] absolute rounded-r-[24px]" />
        <div className="max-h-[655px] largeDesktop: object-cover relative z-10 flex items-center justify-end">
          <Image src={ImgMobile.src} width={780} height={655} alt="phone" />
        </div>
      </div>
      <div className="flex flex-col maxLaptop:container maxSmall:!mx-0 tablet:mx-auto desktop:mr-0 desktop:ml-[130px] justify-center max-w-[510px]">
        <H48 className="!font-bold maxTablet:text-[28px] maxTablet:leading-[34px]">
          {t('titles.download_app')}
        </H48>
        <H18 color="text-gray" className="mt-6 mb-10 maxTablet:my-8">
          {t('text.with_readyhub_get')}
        </H18>
        <div className={'flex gap-6 items-center'}>
          <ApplePayLink type={'black'} />
          <GooglePlayLink />
        </div>
      </div>
    </div>
  )
}
