import { memo } from 'react'

import { IconLink, IconMail, IconSmartphone } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { ShowMore } from '@/components/common/showMoreText/ShowMoreText'
import { H28 } from '@/components/typography'
import { isDirectId } from '@/core/helpers/isDirectProId'
import { ContactCard } from '@/features/profile/components/cardBlock/ContactCard'
import { profileAboutSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
interface Props {
  proId: string
}
export const BioAndContacts = memo(({ proId }: Props) => {
  const { data } = useAppSelector(profileAboutSelector)
  const linksNew = data?.linksNew || []
  return (
    <div>
      <CardWrapper className={'p-8 !h-fit'}>
        <H28>Bio and contacts</H28>
        <ShowMore className={'text-18 text-gray mt-4 '} lines={5}>
          {data.bio}
        </ShowMore>
        {(data.phone || data.email) && (
          <div className="grid gap-5 mt-6 border-t laptop:grid-cols-1 desktop:grid-cols-2 border-lightGray pt-7">
            {data.phone && (
              <ContactCard
                icon={<IconSmartphone />}
                type={'tel'}
                contacts={(data?.phoneCode || '') + data.phone}
                className={'flex py-0 h-[60px] items-center justify-between'}
              />
            )}
            {data.email && (
              <ContactCard
                icon={<IconMail />}
                type="mail"
                contacts={data.email || ''}
                className="flex py-0 h-[60px] items-center justify-between"
              />
            )}
          </div>
        )}
        {isDirectId(proId) && (linksNew || []).length > 0 && (
          <div className="flex flex-wrap border-t border-lightGray pt-7 mt-7 gap-x-10 gap-y-4">
            {linksNew?.map(
              (social: { link: string; title: string }, index: number) => (
                <div key={index} className={'flex items-center gap-3'}>
                  <div
                    key={index}
                    role={'button'}
                    onClick={() => navigator.clipboard.writeText(social?.link)}
                    className="p-2 border rounded-full border-lightGray w-fit"
                  >
                    <IconLink />
                  </div>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={
                      social?.link.startsWith('https://')
                        ? social?.link
                        : `https://${social?.link}`
                    }
                  >
                    <p className="max-w-[200px] truncate">{social?.title}</p>
                  </a>
                </div>
              )
            )}
          </div>
        )}
      </CardWrapper>
    </div>
  )
})
