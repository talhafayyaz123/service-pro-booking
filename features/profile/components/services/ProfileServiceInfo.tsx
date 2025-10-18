import { useRouter } from 'next/router'
import { useMemo } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { H14, H18 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { formatPrice } from '@/core/helpers/formatPrice'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { setDurationTime } from '@/core/helpers/setDurationTime'
import { ImagePreviewCard } from '@/features/profile/components/services/imagePreviewCard/ImagePreviewCard'
import { useIsPreviewProfile } from '@/features/profile/hooks/useIsPreviewProfile'
import { IService } from '@/types/categoriesTypes'
import { TSize } from '@/types/common'

export const ProfileServiceInfo = ({
  buttonSize,
  lines,
  currencySign,
  proId,
  isShowExtraTime = true,
  useProIdfromRouter = false,
  ...rest
}: IService & {
  buttonSize?: TSize
  lines: number
  currencySign: string
  proId: string
  isShowExtraTime?: boolean
  useProIdfromRouter?: boolean
}) => {
  const router = useRouter()
  // const idFromQuery = router.query?.proId as string | undefined
  const idFromQuery = proId as string | undefined

  const href = useMemo(
    () =>
      getUrlWithSearchParams(
        proId
          ? ROUTES.booking(
              useProIdfromRouter && idFromQuery ? idFromQuery : proId
            )
          : '#',
        {
          selectedServices: rest.id,
        }
      ),
    [proId, rest.id, idFromQuery, useProIdfromRouter]
  )
  const isMyProfile = useIsPreviewProfile()

  return (
    <div>
      <div className="flex">
        <ImagePreviewCard image={rest.image} />

        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col gap-1">
            <H18>{rest.name}</H18>
            <H18>
              {setDurationTime(rest.duration)} ·
              {formatPrice({ price: rest.price, currency: currencySign })}{' '}
              {rest.isMobile ? ' · Mobile' : ''}
            </H18>

            {isShowExtraTime && rest.extraTime ? (
              <H14>Extra time: {setDurationTime(rest.extraTime)}</H14>
            ) : null}
          </div>

          <Button
            onClick={() => router.push(href)}
            disabled={isMyProfile}
            size={buttonSize}
            textClassName="!font-bold"
            className="flex-none shadow-none"
            buttonType="lightMain"
          >
            Book
          </Button>
        </div>
      </div>

      <ShowMore
        className="text-14 leading-[18px] small:text-16 small:leading-[22px] mt-5 text-gray"
        lines={lines}
      >
        {rest.description}
      </ShowMore>
    </div>
  )
}
