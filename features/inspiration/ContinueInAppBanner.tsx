import Image from 'next/image'
import Link from 'next/link'
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from 'react'

import { ImgMobile } from '@/assets/images/images'
import { ApplePayLink } from '@/components/common/ApplePayLink'
import { Button } from '@/components/common/buttons/Button'
import { GooglePlayLink } from '@/components/common/GooglePlayLink'
import { Modal, useModalData } from '@/components/modals/Modal'
import { H20 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

const ContinueInAppBanner = () => {
  const { isOpen } = useModalData(MODALS_TYPE.CONTINUE_IN_APP_BANNER)
  const dispatch = useAppDispatch()
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  useEffect(() => {
    return () => {
      dispatch(setModal({}))
    }
  }, [dispatch])
  return (
    <Modal
      maxWidth={1280}
      titleClassName="pb-6 border-b border-lightGray"
      title={
        <H20 className="tablet:text-[24px] tablet:leading-[28px]">
          {t('titles.change_email')}
        </H20>
      }
      space="maxTablet:py-4 py-12"
      wrapperClassName="backdrop-blur-sm flex items-center justify-center small:p-1 text-center"
      outsideClose={false}
      isOpen={isOpen}
      noHeader
      onClose={() => null}
    >
      <div className="flex flex-col justify-between w-full tablet:flex-row gap-x-10 ">
        <div className="flex flex-none tablet:h-[300px] my-auto tablet:w-[350px] laptop:h-[445px] small:max-w-none max-w-[306px] laptop:w-[530px]">
          <Image
            src={ImgMobile.src}
            width={530}
            height={445}
            objectFit={'cover'}
            alt="phone"
          />
        </div>
        <div className="p-6 mx-auto my-auto desktop:pr-[140px] laptop:pr-14 text-start">
          <h1 className="font-bold desktop:text-[48px] desktop:leading-[56px] tablet:text-[32px] tablet:leading-[36px] text-[28px] leading-[34px]">
            Browse inspiration posts and book the look on the Readyhubb app
          </h1>

          <div className="flex flex-col items-center mt-8 small:items-start">
            <div className="flex h-12 gap-6">
              <ApplePayLink type="black" />
              <GooglePlayLink />
            </div>
            <div className="w-full mt-6">
              <Link href={ROUTES.home}>
                <a>
                  <Button className="w-full" buttonType="orange">
                    Back to Home
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ContinueInAppBanner
