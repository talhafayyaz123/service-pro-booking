import Image from 'next/image'
import { memo } from 'react'
import { useSelector } from 'react-redux'

// import { IconMoney } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Distance } from '@/components/cardElements/Distance'
import { Rating } from '@/components/cardElements/Rating'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { ChipBase } from '@/components/Chip/ChipBase'
import { ShareProfile } from '@/components/common/ShareProfile'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H18, H28 } from '@/components/typography'
import { FollowButton } from '@/features/profile/components/common/FollowButton'
import { MainChip } from '@/features/profile/components/common/MainChip'
import { onShowOnMapClick } from '@/features/profile/helpers/onShowMapClick'
import { useIsPreviewProfile } from '@/features/profile/hooks/useIsPreviewProfile'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'

export const ProfileCard = memo(() => {
  const { data, status } = useSelector(profileSelector)
  const {
    name,
    address,
    distance,
    rating,
    categories,
    isFollowing,
    id,
    latitude,
    iconUrl,
    longitude,
    // payInBnpl,
  } = data
  const { country } = useAppSelector(meSelector)

  const isMyProfile = useIsPreviewProfile()
  return (
    <CardWrapper
      className={
        'grid grid-cols-1  laptop:grid-cols-[auto_1fr_auto] gap-[32px] p-[32px]'
      }
    >
      {iconUrl ? (
        <UserIcon size={'72'} iconUrl={iconUrl} />
      ) : (
        <div
          className={
            'p-4 bg-[#EDDFFF] rounded-full overflow-hidden w-[72px] h-[72px]'
          }
        >
          <Image alt={'alt pro icon'} src={ImgProUser} />
        </div>
      )}
      <div>
        {!status ? (
          <H28>{name || ''}</H28>
        ) : (
          <BaseSkeleton className={'!h-[28px] mb-[8px]'} />
        )}
        {!status ? (
          <H18 className={'mt-1 '}>{address || ''}</H18>
        ) : (
          <BaseSkeleton className={'mt-1 w-[300px]'} />
        )}
        <Distance
          className="mt-2"
          onClick={latitude && longitude ? onShowOnMapClick : undefined}
          status={status}
          distance={distance}
          country={country}
        />

        <div className={'laptop:hidden flex gap-4 mt-4'}>
          <div className={'flex-shrink-0'}>
            <Rating rating={rating} status={status} />
          </div>

          {/*<FollowButton follow={isFollowing} />*/}
        </div>
        <div className={'flex flex-wrap mt-5 gap-4'}>
          <MainChip {...data} />

          {/* {payInBnpl && (
            <ChipBase
              textClassName={'!text-black'}
              size="14"
              name={'Buy now, Pay later'}
              rightIcon={<IconMoney />}
              className="border-orange2"
            />
          )} */}

          {!status
            ? (categories || []).map(({ name, id }) => (
                <ChipBase
                  key={id}
                  textClassName={'block'}
                  size={'14'}
                  name={name}
                />
              ))
            : [...new Array(4)].map((_, index) => (
                <ChipBase
                  key={index}
                  textClassName={
                    'block w-[80px] h-[18px] bg-lightGray  rounded-[12px] animate-pulse'
                  }
                  size={'14'}
                  name={''}
                />
              ))}
        </div>
      </div>
      <div className={'maxSmall:hidden flex gap-4'}>
        <ShareProfile />
        <div className={'flex-shrink-0'}>
          <Rating rating={rating} status={status} />
        </div>
        <FollowButton
          isDisabled={isMyProfile}
          proId={id}
          follow={isFollowing}
        />
      </div>
    </CardWrapper>
  )
})
