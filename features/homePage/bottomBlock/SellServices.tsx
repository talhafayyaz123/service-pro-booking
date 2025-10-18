import Image from 'next/image'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'

import { ImgSell } from '@/assets/images/images'
import { Button } from '@/components/common/buttons/Button'
import { H18, H48 } from '@/components/typography'
import { BECOME_A_PRO_WEBSITE_URL } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const SellServices = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  const { t: common } = useTranslation(TRANSLATE_KEYS.common)
  const session = useSession()
  return (
    <>
      {session.data?.user.role !== 'PRO' ? (
        <div className="container h-full laptop:mt-[179px] laptop:mb-[120px] relative">
          <div className="rounded-xl laptop:shadow-xl items-center maxLaptop:my-20 maxSmall:pt-0 laptop:p-[60px] desktop:py-[108px]  desktop:px-20">
            <div className="laptop:max-w-[510px] maxSmall:mx-0 maxLaptop:mx-auto">
              <H48 className="!font-bold maxTablet:text-[28px] maxTablet:leading-[34px]">
                {t('text.sell_your_services')}
              </H48>
              <H18 color="text-gray" className="mt-6 mb-6 tablet:mb-8">
                {t('text.list_your_business')}
              </H18>
              <a
                href={BECOME_A_PRO_WEBSITE_URL}
                target="_blank"
                rel="noreferrer"
              >
                <Button className="maxTablet:w-full" buttonType="3d">
                  {common('buttons.become_a_pro')}
                </Button>
              </a>
            </div>

            <div className="maxLaptop:hidden maxDesktop:w-[330px] flex absolute bottom-0 right-[60px]">
              <Image
                objectFit="fill"
                priority={false}
                width={550}
                height={510}
                alt={''}
                src={ImgSell.src}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="my-20" />
      )}
    </>
  )
}
