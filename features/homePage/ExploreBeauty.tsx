import Image from 'next/image'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useState } from 'react'

import { ImgHomepageBanner } from '@/assets/images/images'
import { NewAppStoreLink } from '@/components/common/ApplePayLink'
import { SearchNearbyButton } from '@/components/common/buttons/SearchNearbyButton'
import { NewGooglePlayLink } from '@/components/common/GooglePlayLink'
import { QRCode } from '@/components/qrCode/QRCode'
import { H24, H38 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { NewMobileSearchInput } from '@/features/search/NewSerachInput/NewMobileSearchInput'
import { useMediaScreen } from '@/hooks/useMediaScreen'

export const ExploreBeauty = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  const { isTablet, isSmall } = useMediaScreen()
  const [onFocus, setOnFocus] = useState(false)
  const session = useSession()

  return (
    <div className="overflow-hidden relative bg-violet">
      <div
        className={`${
          onFocus ? '' : 'container px-5 tablet:px-4'
        } tablet:mt-[68px] mx-auto`}
      >
        <div className="flex maxTablet:items-end maxTablet:justify-between md:mb-[-67px] mt-5 relative">
          <div className="max-w-[620px] flex flex-col laptop:mb-[120px]">
            <H38 className="maxTablet:hidden desktop:!text-[80px] desktop:!leading-[84px] laptop:mt-[62px] mb-6 !font-bold desktop:w-full sm:w-3/5">
              {t('titles.explore_beauty_around')}
            </H38>
            <H38 className="!font-bold mb-4 tablet:hidden">
              {t('titles.explore_beauty_around')}
            </H38>
            {(isTablet || isSmall) && session.data?.user.role !== 'PRO' && (
              <div className="mb-6 tablet:hidden">
                <NewMobileSearchInput
                  sideEffect={(v) => setOnFocus(v)}
                  isGridView={false}
                  toggleGridView={() => null}
                />
                {/*<SearchMobileInput*/}
                {/*  sideEffect={(v) => setOnFocus(v)}*/}
                {/*  isGridView={false}*/}
                {/*  toggleGridView={() => null}*/}
                {/*/>*/}
              </div>
            )}
            <H24 className="maxTablet:hidden !text-gray !font-normal mb-8 desktop:w-4/5 tablet:w-3/5">
              {t('text.instantly_book')}
            </H24>
            <div className={'flex gap-2 items-center mb-8 tablet:hidden'}>
              <NewAppStoreLink />
              <NewGooglePlayLink />
            </div>
            <div className="hidden tablet:flex maxTablet:mb-10 items-center gap-6">
              <SearchNearbyButton />
              <QRCode />
            </div>
          </div>
          <div>
            <div className="desktop:block hidden laptop:ml-6 absolute top-0 right-10 w-[690px] h-[730px]">
              <Image
                alt={'banner'}
                objectFit={'fill'}
                priority={true}
                layout="fill"
                quality={100}
                src={ImgHomepageBanner.src}
              />
            </div>
            <div className="mr-2 ml-3 absolute top-0 maxLaptop:-right-1.5 right-0 w-[550px] h-[550px] maxLaptop:w-[310px] maxLaptop:h-[303px] tablet:block hidden desktop:hidden">
              <Image
                objectFit={'fill'}
                layout="fill"
                priority={true}
                quality={80}
                src={ImgHomepageBanner.src}
                alt="homepage banner"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
