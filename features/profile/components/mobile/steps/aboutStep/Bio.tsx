import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { H20 } from '@/components/typography'
import { profileAboutSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

export const Bio = () => {
  const { data } = useAppSelector(profileAboutSelector)
  return (
    <CardWrapper>
      <H20>Bio</H20>
      <ShowMore className={'text-16 leading-[22px] mt-5'} lines={5}>
        {data.bio}
      </ShowMore>
    </CardWrapper>
  )
}
