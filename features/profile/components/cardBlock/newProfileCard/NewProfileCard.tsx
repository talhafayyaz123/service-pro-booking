import { useSelector } from 'react-redux'

import { IconShare } from '@/assets/icons/icons'
import { IconMessage } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { Button } from '@/components/common/buttons/Button'
import { ShareProfile } from '@/components/common/ShareProfile'
import { H16 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { CategoryList } from '@/features/profile/components/cardBlock/newProfileCard/CategoryList'
import { ProfileImage } from '@/features/profile/components/cardBlock/newProfileCard/ProfileImage'
import { ProfileInfo } from '@/features/profile/components/cardBlock/newProfileCard/ProfileInfo'
import { RatingBadge } from '@/features/profile/components/cardBlock/newProfileCard/RatingBadge'
import { MainChip } from '@/features/profile/components/common/MainChip'
import { useIsPreviewProfile } from '@/features/profile/hooks/useIsPreviewProfile'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch } from '@/hooks/hooks'
import { useStoreLinks } from '@/hooks/useStoreLinks'
import { setModal } from '@/store/modals/modalsSlice'

import { StyledFollowButton } from '../../common/StyledFollowButton'

const NewProfileCard = () => {
  const dispatch = useAppDispatch()
  const { handleStoreClick, isMobile } = useStoreLinks()

  const onOpenModal = () => {
    isMobile
      ? handleStoreClick()
      : dispatch(setModal({ currentModal: MODALS_TYPE.MESSAGE_PRO_MODAL }))
  }

  const isMyProfile = useIsPreviewProfile()
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
    country,
  } = data

  return (
    <>
      <CardWrapper className="flex items-center flex-col space-y-9 p-8 h-full">
        <div className="flex items-center flex-col space-y-6">
          <div className="flex flex-col items-center">
            <ProfileImage
              iconUrl={iconUrl}
              onClick={() => {
                if (iconUrl && iconUrl !== 'https://string') {
                  dispatch(
                    setModal({
                      currentModal: MODALS_TYPE.VIEW_PROFILE_IMAGE_MODAL,
                    })
                  )
                }
              }}
            />
            <RatingBadge rating={rating} />
          </div>

          <ProfileInfo
            status={status}
            name={name}
            address={address}
            latitude={latitude || null}
            longitude={longitude || null}
            distance={distance}
            country={country}
          />

          <div className="flex gap-x-2.5 w-full">
            <Button
              className="w-full !bg-transparent !shadow-none laptop:max-w-[130px]"
              onClick={onOpenModal}
            >
              <div className="flex items-center justify-center gap-x-2">
                <IconMessage className="w-5 h-5" />
                <H16 className="!font-bold">Message</H16>
              </div>
            </Button>
            <StyledFollowButton
              isDisabled={isMyProfile}
              proId={id}
              follow={isFollowing}
            />
            <ShareProfile className="!flex justify-center items-center !bg-transparent !shadow-none !h-[50px] !w-12 !px-0 shrink-0">
              <IconShare className="w-5 h-5" />
            </ShareProfile>
          </div>

          <hr className="w-full border-0 border-t-[1px] border-lightGray" />

          <div className={'flex justify-start flex-wrap mt-5 gap-4 w-full'}>
            <MainChip {...data} />
            <CategoryList status={status} categories={categories} />
          </div>
        </div>
      </CardWrapper>
    </>
  )
}

export default NewProfileCard
