import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { memo } from 'react'

import { ImgProUser } from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { Button } from '@/components/common/buttons/Button'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { H14, H16, H18 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'
import { FollowButton } from '@/features/profile/components/common/FollowButton'
import { IProInfo } from '@/features/profile/profileType'
import { getFavoritesRequest } from '@/features/userProfile/store/userProfileRequests'
import { favoritesSelector } from '@/features/userProfile/store/userProfileSelectors'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'

export const Professionals = () => {
  const { data, total, page, status } = useAppSelector(favoritesSelector)
  const dispatch = useAppDispatch()
  const session = useSession()
  return (
    <div>
      <div
        className={
          'grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 tablet:gap-x-10 tablet:gap-y-6 gap-3'
        }
      >
        {status
          ? [...new Array(data.length || 10)].map((_, index) => (
              <ProCardSkeleton key={index} />
            ))
          : data.map((el) => <ProCard key={el.id} {...el} />)}
      </div>
      {data.length === 0 && status === false && (
        <H18>
          {session.data?.user.role === 'PRO'
            ? 'No inspiration posts saved yet - find pros and save posts you love'
            : 'You are not following any pros'}
        </H18>
      )}
      {total > data.length && data.length ? (
        <div className={'flex justify-end mt-5'}>
          <Button
            onClick={() =>
              dispatch(getFavoritesRequest({ page: page + 1, type: 'update' }))
            }
          >
            Show more
          </Button>
        </div>
      ) : null}
    </div>
  )
}

const ProCard = memo(
  ({ iconUrl, isFollowing, id, name, categories, slug }: IProInfo) => {
    const categoriesArr = categories.map((el) => el.name)
    return (
      <Link href={ROUTES.profile(slug || id) ?? '#'}>
        <CardWrapper
          className={
            ' hover:scale-105 transition cursor-pointer grid grid-cols-[40px_1fr_100px] items-center !p-3 !pb-2.5'
          }
        >
          {iconUrl ? (
            <UserIcon iconUrl={iconUrl} size={'40'} />
          ) : (
            <div
              className={
                'w-10 h-10 rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
              }
            >
              <Image alt={'alt pro icon'} src={ImgProUser} />
            </div>
          )}
          <div className={'ml-3 mr-4 truncate !text-gray '}>
            <H16 className={'truncate '}>{name}</H16>
            <H14 color={'text-gray'} className={''}>
              {[...categoriesArr].join(', ')}
            </H14>
          </div>
          <FollowButton
            buttonProps={{ buttonType: 'lightMain', size: '42' }}
            proId={id}
            follow={isFollowing}
          />
        </CardWrapper>
      </Link>
    )
  }
)

const ProCardSkeleton = () => {
  return (
    <CardWrapper className={'flex'}>
      <UserIcon size={'40'} />
      <div className={'ml-3 mr-4 flex flex-col justify-between'}>
        <BaseSkeleton className={'!h-5 !w-[60%]'} />
        <BaseSkeleton className={'!h-4'} />
      </div>
      <BaseSkeleton className={'h-[44px]  !w-[80px]'} />
    </CardWrapper>
  )
}
