import { IconCommentIcon } from '@/assets/icons/icons'
import { FingerLike } from '@/components/cardElements/FingerLike'
import { Like } from '@/components/cardElements/Like'
import { MiniUserIcon } from '@/components/cardElements/MiniUserIcon'
import { H14, H18 } from '@/components/typography'
import { IInspirationCard } from '@/types/instiprationTypes'

export const InspirationFollowingCard = ({
  contentUrl,
  likesCount,
  isLiked,
  description,
  className,
  commentsCount,
  onClick,
  pro,
}: Partial<IInspirationCard> & {
  className?: string
  onClick?: () => void
}) => {
  return (
    <div
      role={'button'}
      onClick={onClick}
      className={`${
        onClick ? 'cursor-pointer' : ''
      } h-full w-full overflow-hidden shadow-xl  flex flex-col flex-shrink-0 w-full relative  bg-white rounded-[12px] p-[20px]  ${className}`}
    >
      <div
        className={`bg-cover bg-center flex w-full p-6 h-full overflow-hidden   rounded-[12px]  bg-white  ${
          contentUrl ? '' : 'bg-lightGray animate-pulse'
        }`}
        style={{
          backgroundImage: contentUrl ? `url(${contentUrl})` : '',
          // filter: 'brightness(0.9)',
        }}
      >
        <Like className={'ml-auto'} isLiked={isLiked} />
      </div>
      <div className={'mt-[20px]'}>
        <H18 className={'line-clamp-2'}>{description}</H18>
      </div>
      <div className={'mt-[16px] flex  justify-between'}>
        <MiniUserIcon textColor={'text-black'} {...pro} />

        <div
          className={'flex items-center justify-start flex-shrink-0 gap-[20px]'}
        >
          <FingerLike
            onDislike={() => null}
            onLike={() => null}
            likesCount={likesCount}
          />
          <div
            role={'button'}
            onClick={(e) => {
              e.stopPropagation()
            }}
            className={'flex items-center gap-x-[10px]'}
          >
            <IconCommentIcon />
            <H14>{commentsCount || ''}</H14>
          </div>
        </div>
      </div>
    </div>
  )
}
