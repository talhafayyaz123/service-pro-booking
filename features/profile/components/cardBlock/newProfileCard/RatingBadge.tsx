import { IconStar14 } from '@/assets/icons/icons'
import { H16 } from '@/components/typography'
import { fixInteger } from '@/core/helpers/fixInteger'

export const RatingBadge = ({ rating }: { rating: number }) => {
  if (+rating <= 0) return null

  const handleClick = () => {
    const element = document.getElementById('reviews-section')
    element?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    })
  }

  return (
    <div
      style={{ boxShadow: '0px 4px 20px rgba(171, 173, 215, 0.2)' }}
      role="button"
      onClick={handleClick}
      className="w-[67px] h-[32px] -mt-4 cursor-pointer hover:bg-slate-50 bg-white rounded-full border border-lightGray py-2 px-3 flex justify-center items-center z-10"
    >
      <div className={'flex items-center space-x-2'}>
        <IconStar14 className={'fill-orange -mt-0.5'} />
        <H16 color={'text-black'} className="leading-[24px]">
          {fixInteger(rating).toFixed(1)}
        </H16>
      </div>
    </div>
  )
}
