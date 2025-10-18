import { Fragment, useState } from 'react'

import { ImgAllTopics } from '@/assets/images/images'
import { ChipBase } from '@/components/Chip/ChipBase'
import { Spinner } from '@/components/Loaders'
import { H24, H48 } from '@/components/typography'
import { BlogPostCard } from '@/features/blogPosts/BlogPostCard'
import { ChipWithIcon } from '@/features/inspiration/tabs/forYou/ForYou'
import { useAppSelector } from '@/hooks/hooks'
import { mainCategoriesSelector } from '@/store/accountSetup/accountSetupSelectors'
import { useGetBlogPostsQuery } from '@/store/commonStor/inspirations/inspirationsRequests'

export const BlogPosts = () => {
  const { categories } = useAppSelector(mainCategoriesSelector)
  const [category, setCategory] = useState<string[]>([])
  const { isFetching, data } = useGetBlogPostsQuery({
    page: 1,
    limit: 20,
    businessTypeIds: category,
  })

  const handleSetFilter = (id: string) => {
    setCategory((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    )
  }

  return (
    <section className={'container h-full mb-[120px]'}>
      <H48 className={'font-medium'}>Blog posts</H48>
      <div
        className={
          ' flex laptop:pl-[16px] laptop:ml-[-16px] mb-[60px]  laptop:pr-[16px] laptop:mr-[-16px] gap-[8px] z-10 relative laptop:gap-[20px] py-[20px] mt-[32px] overflow-x-auto scrollbar-none'
        }
      >
        <div className={'laptop:hidden'}>
          <ChipBase
            name={'All topics'}
            onClick={() => setCategory([])}
            active={category.length === 0}
            color={'#A4B1F5'}
            iconUrl={ImgAllTopics.src}
          />
        </div>
        <div className={'hidden laptop:block relative'}>
          <ChipWithIcon
            name={'All topics'}
            iconUrl={ImgAllTopics.src}
            color={'#A4B1F5'}
            onClick={() => setCategory([])}
            active={category.length === 0}
          />
        </div>
        {categories.map(({ id, ...el }) => {
          const active = category.includes(id)
          return (
            <Fragment key={id}>
              <div className={'laptop:hidden'}>
                <ChipBase
                  {...el}
                  id={id}
                  onClick={() => handleSetFilter(id)}
                  active={active}
                />
              </div>
              <div className={'hidden laptop:block relative'}>
                <ChipWithIcon
                  {...el}
                  id={id}
                  onClick={() => handleSetFilter(id)}
                  active={active}
                />
              </div>
            </Fragment>
          )
        })}
      </div>
      <div className={'relative min-h-[200px]'}>
        {isFetching && (
          <div
            className={
              ' absolute backdrop-blur-[3px]  w-full h-full top-0 z-[1]'
            }
          >
            <div
              className={
                'absolute top-1/2  left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[2] '
              }
            >
              <Spinner />
            </div>
          </div>
        )}
        {(data?.data || []).length === 0 ? (
          <div className={'flex items-center justify-center'}>
            <H24 className={'font-medium'}>
              There are no blog posts in this topic
            </H24>
          </div>
        ) : (
          <div className="grid grid-cols-2 laptop:grid-cols-3 gap-3 tarblet:gap-10 ">
            {data?.data?.map((blogPost) => (
              <BlogPostCard {...blogPost} key={blogPost.id} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
