import moment from 'moment'
import Image from 'next/image'

import { IconCommentSpace, IconStart } from '@/assets/icons/icons'
import { ImgProUser, ImgUser } from '@/assets/images/images'
import { Rating } from '@/components/cardElements/Rating'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { ChipBase } from '@/components/Chip/ChipBase'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { H14, H16, H18 } from '@/components/typography'
import { transformProName } from '@/core/helpers/transformProName'
import { ReviewImageWithTooltip } from '@/features/profile/components/reviews/components/ReviewImageWithTooltip'
import { IProfileReview } from '@/features/profile/profileType'
import { TRole } from '@/types/common'

export const MobileComment = (props: {
  iconUrl: string
  firstName: string
  lastName: string
  createdDate: string
  description: string
  rating: number
  service: IProfileReview['service']
  answers: IProfileReview['answers']
  photos: (string | undefined)[]
  role: TRole
}) => {
  const {
    iconUrl,
    firstName,
    lastName,
    createdDate,
    rating,
    service,
    description,
    photos,
    answers,
    role,
  } = props

  return (
    <div className={`py-5 border-b border-lightGray`}>
      <>
        <div className="flex justify-between">
          <div className="flex gap-3">
            {iconUrl ? (
              <UserIcon iconUrl={iconUrl} size="56" />
            ) : (
              <div
                style={{
                  backgroundColor: role === 'PRO' ? '#EDDFFF' : '#F9DFE6',
                }}
                className={
                  'p-1.5  h-[42px] w-[42px] rounded-full overflow-hidden'
                }
              >
                <Image
                  alt={'alt  icon'}
                  src={role === 'PRO' ? ImgProUser : ImgUser}
                />
              </div>
            )}
            <div className="flex flex-col gap-0.5">
              <H16>
                {firstName} {lastName}
              </H16>
              <H14 color="text-gray">
                {moment(createdDate || new Date()).format('MMM D, Y')}
              </H14>
            </div>
          </div>
          <Rating
            textClassName="!text-14"
            starIcon={
              <IconStart height="18" width="18" className="fill-orange" />
            }
            className="!p-0 shadow-none"
            rating={rating}
          />
        </div>
        <div className={'flex flex-wrap gap-1 mb-3 mt-4'}>
          {(service || []).map((item) => (
            <ChipBase
              key={item.id}
              size="12"
              className="py-0.5"
              textClassName="!font-normal"
              name={item.name}
            />
          ))}
        </div>
        <H18>
          <ShowMore>{description}</ShowMore>
        </H18>
        {photos.length > 0 && (
          <div className={'mt-4 flex flex-wrap gap-3'}>
            {(photos || []).map((src, index) => (
              <ReviewImageWithTooltip key={index} imgSrc={src || ''} />
            ))}
          </div>
        )}
      </>
      <Answer answers={answers} />
    </div>
  )
}

const Answer = ({ answers }: { answers: IProfileReview['answers'] }) => {
  return (
    <div>
      {answers.map(({ userInfo, description, id, createdAt }) => (
        <div className={'flex gap-3 ml-6 mt-3'} key={id}>
          <IconCommentSpace />
          <div className={'flex flex-col w-full'}>
            <div className="flex gap-5">
              {userInfo.iconUrl ? (
                <UserIcon iconUrl={userInfo.iconUrl} size="42" />
              ) : (
                <div
                  className={
                    'w-[42px] h-[42px]  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
                  }
                >
                  <Image alt={'alt pro icon'} src={ImgProUser} />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <H16>
                  {userInfo.businessName ||
                    transformProName(userInfo.firstName, userInfo.lastName)}
                </H16>
                <H14 color="text-gray">
                  {moment(createdAt || new Date()).format('MMM D, Y')}
                </H14>
              </div>
            </div>
            <H18>
              <ShowMore>{description}</ShowMore>
            </H18>
          </div>
        </div>
      ))}
    </div>
  )
}
