import moment from 'moment'
import Image from 'next/image'

import { IconCommentSpace } from '@/assets/icons/icons'
import { ImgProUser, ImgUser } from '@/assets/images/images'
import { Rating } from '@/components/cardElements/Rating'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { ChipBase } from '@/components/Chip/ChipBase'
import { H18, H24 } from '@/components/typography'
import { transformProName } from '@/core/helpers/transformProName'
import { ReviewImageWithTooltip } from '@/features/profile/components/reviews/components/ReviewImageWithTooltip'
import { IProfileReview } from '@/features/profile/profileType'
import { TRole } from '@/types/common'

export const DesktopComment = (props: {
  isFirst: boolean
  iconUrl: string
  firstName: string
  lastName: string
  createdDate: string
  description: string
  role: TRole
  rating: number
  service: IProfileReview['service']
  answers: IProfileReview['answers']
  photos: (string | undefined)[]
}) => {
  const {
    isFirst,
    iconUrl,
    firstName,
    lastName,
    role,
    createdDate,
    rating,
    service,
    description,
    photos,
    answers,
  } = props

  return (
    <div
      className={`${
        isFirst ? ' border-t border-lightGray' : ''
      } py-8 border-b border-lightGray`}
    >
      <div className="flex justify-between">
        <div className="flex gap-5">
          {iconUrl ? (
            <UserIcon iconUrl={iconUrl} size="56" />
          ) : (
            <div
              style={{
                backgroundColor: role === 'PRO' ? '#EDDFFF' : '#F9DFE6',
              }}
              className={
                'p-1.5  h-[52px] w-[52px] rounded-full overflow-hidden'
              }
            >
              <Image
                alt={'alt  icon'}
                src={role === 'PRO' ? ImgProUser : ImgUser}
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <H24>{transformProName(firstName, lastName)}</H24>
            <H18 color="text-gray">
              {moment(createdDate || new Date()).format('MMM D, Y')}
            </H18>
          </div>
        </div>
        <Rating rating={rating} />
      </div>
      {(service || []).length !== 0 && (
        <div className="flex flex-wrap gap-2 mt-5">
          {service.map(({ id, name }) => (
            <ChipBase
              key={id}
              size="16"
              className=" py-1.5"
              textClassName="!font-normal"
              name={name}
            />
          ))}
        </div>
      )}
      <div className={'mt-5'}>
        <H18>{description}</H18>
        <div className="flex flex-wrap gap-3 mt-4">
          {(photos || []).map((src, index) => (
            <ReviewImageWithTooltip key={index} imgSrc={src || ''} />
          ))}
        </div>
      </div>
      <Answer answers={answers} />
    </div>
  )
}

const Answer = ({ answers }: { answers: IProfileReview['answers'] }) => {
  return (
    <div>
      {answers.map(({ userInfo, description, id, createdAt }) => (
        <div className={'flex gap-4 ml-6'} key={id}>
          <IconCommentSpace className={'scale-150'} />
          <div className={'flex flex-col'}>
            <div className="flex gap-5">
              {userInfo.iconUrl ? (
                <UserIcon iconUrl={userInfo.iconUrl} size="56" />
              ) : (
                <div
                  className={
                    'w-[56px] h-[56px]  rounded-full overflow-hidden p-1 bg-[#EDDFFF]'
                  }
                >
                  <Image alt={'alt pro icon'} src={ImgProUser} />
                </div>
              )}
              <div className="flex flex-col gap-1">
                <H24>
                  {userInfo.businessName ||
                    transformProName(userInfo.firstName, userInfo.lastName)}
                </H24>
                <H18 color="text-gray">
                  {moment(createdAt || new Date()).format('MMM D, Y')}
                </H18>
              </div>
            </div>
            <H18 className={'mt-5'}>{description}</H18>
          </div>
        </div>
      ))}
    </div>
  )
}
