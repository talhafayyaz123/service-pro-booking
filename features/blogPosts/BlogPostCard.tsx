import moment from 'moment'

import { H16, H24 } from '@/components/typography'
import { IBlogPosts } from '@/features/inspiration/types'

export const BlogPostCard = ({
  iconUrl,
  url,
  businessTypes,
  title,
  createdAt,
}: IBlogPosts) => {
  return (
    <div
      role={'link'}
      onClick={() => {
        url && window.open(url, '_blank')
      }}
      className={
        'flex flex-col h-full w-full hover:shadow-xl transition cursor-pointer p-2 rounded-[16px]'
      }
    >
      <div
        className={
          ' h-[200px] tablet:h-[284px] w-full  flex items-center justify-center rounded-[16px] overflow-hidden'
        }
      >
        <img
          className={'w-full h-full object-cover '}
          alt={'blog'}
          src={iconUrl}
        />
      </div>
      <div
        className={'flex flex-nowrap overflow-auto gap-2 mt-6 scrollbar-none'}
      >
        {businessTypes.map(({ title, id }) => (
          <div
            className={
              'bg-[#FEF0EC] flex-shrink-0 px-2 py-1 tablet:px-4 tablet:py-2 rounded-full '
            }
            key={id}
          >
            <H16
              color={'text-orange'}
              className={'maxTablet:!text-[12px] maxTablet:!leading-4 '}
            >
              {title}
            </H16>
          </div>
        ))}
      </div>
      <H24
        className={
          '!text-16 !leading-5 line-clamp-2 tablet:!leading-8 tablet:!text-24 !font-medium block mt-2 tablet:mt-4'
        }
      >
        {title}
      </H24>
      <div
        className={
          'flex gap-x-2 tablet:gap-x-3 items-center flex-wrap mt-2 tablet:mt-4'
        }
      >
        <H16
          className={
            'maxTablet:!leading-4 maxTablet:!text-[12px] text-[#929296]'
          }
        >
          {createdAt ? moment(createdAt).format('DD MMMM YYYY') : ''}
        </H16>
        {/*<div className={'w-1.5 h-1.5  rounded-full bg-[#929296]'} />*/}
        {/*<H16*/}
        {/*  className={*/}
        {/*    'maxTablet:!leading-4  maxTablet:!text-[12px] text-[#929296]'*/}
        {/*  }*/}
        {/*>*/}
        {/*  5 min read*/}
        {/*</H16>*/}
      </div>
    </div>
  )
}
