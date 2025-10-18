import Image from 'next/image'
import { memo, useCallback } from 'react'
import { useSelector } from 'react-redux'

import { IconMessage } from '@/assets/icons/icons'
// import { IconMoney } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { Distance } from '@/components/cardElements/Distance'
import { Rating } from '@/components/cardElements/Rating'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { ChipBase } from '@/components/Chip/ChipBase'
import { BackButton } from '@/components/common/buttons/BackButton'
import { Button } from '@/components/common/buttons/Button'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { ITab, Stepper } from '@/components/common/steppers/Stepper'
import { H12, H16, H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { FollowButton } from '@/features/profile/components/common/FollowButton'
import { MainChip } from '@/features/profile/components/common/MainChip'
import { useProfileSteps } from '@/features/profile/hooks/useProfileSteps'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { setStep } from '@/features/profile/store/profileSlice'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { useStoreLinks } from '@/hooks/useStoreLinks'
import { meSelector } from '@/store/me/meSelector'
import { setModal } from '@/store/modals/modalsSlice'

import { useIsPreviewProfile } from '../../hooks/useIsPreviewProfile'
import { StyledFollowButton } from '../common/StyledFollowButton'

export const ProfileInfoMobile = memo(() => {
  const { data, status } = useSelector(profileSelector)
  const {
    name,
    address,
    distance,
    rating,
    categories,
    iconUrl,
    isFollowing,
    id,
  } = data
  const { country } = useAppSelector(meSelector)
  const dispatch = useAppDispatch()

  const currentTab = useAppSelector((state) => state.profile.step)
  const { handleStoreClick, isMobile } = useStoreLinks()

  const onOpenModal = () => {
    isMobile
      ? handleStoreClick()
      : dispatch(setModal({ currentModal: MODALS_TYPE.MESSAGE_PRO_MODAL }))
  }

  const isMyProfile = useIsPreviewProfile()

  const handleShowOnMap = useCallback(async () => {
    if (currentTab !== 'about') {
      await dispatch(setStep('about'))
    }
    const scroll_section = await document.getElementById('location_map')
    await scroll_section?.scrollIntoView({ behavior: 'smooth' })
    // location.href = '#location_map'
  }, [currentTab, dispatch])

  return (
    <div className={'relative  mt-[-22px] pb-5'}>
      <div className={'top-[-50px] left-0 w-full  absolute'}>
        <div className={' flex justify-between w-full'}>
          <div className={'bg-white p-[3px] rounded-full overflow-hidden'}>
            {iconUrl ? (
              <UserIcon size="100" className="border-white" iconUrl={iconUrl} />
            ) : (
              <div
                className={
                  'p-2 bg-[#EDDFFF] rounded-full w-[100px] h-[100px] flex items-center justify-center'
                }
              >
                <Image
                  alt={'alt pro icon'}
                  src={ImgProUser}
                  className="p-4"
                  width={70}
                  height={70}
                />
              </div>
            )}
          </div>
          <Rating
            rating={rating}
            largeStar={true}
            className="top-[30px] absolute right-0 !font-normal !px-3 !py-[9px] !h-[48px] !w-[83px] !rounded-[41px]"
            textClassName="!leading-[22px]"
          />
        </div>
      </div>
      <div className={'pt-[58px] flex flex-col gap-4'}>
        <div>
          {!status ? (
            <H28>{name}</H28>
          ) : (
            <BaseSkeleton className={'!h-[28px] mb-[8px]'} />
          )}
          <div>
            {!status ? (
              <H12>{address || ''}</H12>
            ) : (
              <BaseSkeleton className={'w-[300px]'} />
            )}
          </div>
        </div>

        <Distance
          className={''}
          status={status}
          onClick={handleShowOnMap}
          distance={distance}
          country={country}
        />

        <div className={'flex gap-2 flex-wrap'}>
          <MainChip
            {...data}
            chipProps={{ className: '!py-[5px]', size: '12' }}
          />
          {/* {payInBnpl && (
            <ChipBase
              textClassName={'!text-black'}
              name={'Buy now, Pay later'}
              rightIcon={<IconMoney />}
              className="border-orange2 !py-[5px]"
            />
          )} */}
          {!status
            ? categories.map(({ name, id }) => (
                <ChipBase
                  className={'!py-[5px]'}
                  key={id}
                  textClassName={'block'}
                  name={name}
                />
              ))
            : [...new Array(2)].map((_, index) => (
                <ChipBase
                  className={'!py-[5px]'}
                  key={index}
                  textClassName={
                    'block w-[80px] h-[18px] bg-lightGray  rounded-[12px] animate-pulse'
                  }
                  name={''}
                />
              ))}
        </div>

        <div className="flex gap-x-2.5 w-full">
          <Button
            className="w-full !bg-transparent !shadow-none"
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
        </div>
      </div>
    </div>
  )
})

export const ProfileInfoMobileLight = memo(() => {
  const { data } = useSelector(profileSelector)
  const { tabs, currentTab } = useProfileSteps()

  const currentTabs = (tabs.filter((e) => e !== null) as ITab[]).map(
    ({ content: _, ...rest }) => ({ ...rest })
  )
  return (
    <div>
      <div className={'flex items-center justify-between py-4 px-5'}>
        <div className={'flex items-center gap-3'}>
          <div className={'w-fit'}>
            <BackButton />
          </div>
          <H16 className={'!font-bold'}>{data.name}</H16>
        </div>
        <FollowButton
          proId={data.id}
          buttonProps={{ size: '40' }}
          follow={data.isFollowing}
        />
      </div>
      <Stepper
        className={'small:hidden  relative'}
        currentTab={currentTab}
        stepsClassName={'justify-around px-4 pb-2'}
        wrapperClassName={''}
        labelClassName={'!text-14 !font-normal !leading-[18px] mb-2'}
        tabs={currentTabs}
      />
    </div>
  )
})
