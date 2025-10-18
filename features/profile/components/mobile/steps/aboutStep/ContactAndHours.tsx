import { IconLink, IconMail, IconSmartphone } from '@/assets/icons/icons'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H20 } from '@/components/typography'
import { isDirectId } from '@/core/helpers/isDirectProId'
import { ContactCard } from '@/features/profile/components/cardBlock/ContactCard'
import { WorkHoursRow } from '@/features/profile/components/cardBlock/ProfileBusinessHours'
import {
  profileAboutSelector,
  profileBusinessHoursSelector,
} from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
interface Props {
  proId: string
}
export const ContactAndHours = ({ proId }: Props) => {
  const { data } = useAppSelector(profileAboutSelector)
  const hours = useAppSelector(profileBusinessHoursSelector)
  return (
    <CardWrapper className={'pt-6'}>
      <H20>Contact & Business hours</H20>

      <div className={'grid grid-cols-1 gap-3 mt-5'}>
        {data.phone && (
          <ContactCard
            icon={<IconSmartphone />}
            type={'tel'}
            contacts={data.phone}
            className={'flex py-0 h-[50px] items-center justify-between'}
          />
        )}
        {data.email && (
          <ContactCard
            icon={<IconMail />}
            type={'mail'}
            contacts={data.email}
            className={'flex py-0 h-[50px] items-center justify-between '}
          />
        )}
        {isDirectId(proId) && (data.linksNew || []).length > 0 && (
          <div className="flex flex-wrap mt-7 gap-x-10 gap-y-4">
            {data?.linksNew?.map(
              (social: { link: string; title: string }, index: number) => (
                <div
                  key={index}
                  className={'flex items-center gap-3 overflow-hidden'}
                >
                  <div
                    role={'button'}
                    onClick={() => navigator.clipboard.writeText(social?.link)}
                    className="p-2 border rounded-full cursor-pointer border-lightGray w-fit"
                  >
                    <IconLink />
                  </div>
                  <a
                    target="_blank"
                    href={
                      social?.link.startsWith('https://')
                        ? social?.link
                        : `https://${social?.link}`
                    }
                    className="truncate"
                    rel="noreferrer"
                  >
                    {social?.title}
                  </a>
                  {/*<p className="truncate">{link}</p>*/}
                </div>
              )
            )}
          </div>
        )}
        <div
          className={`flex flex-col gap-4 ${
            data.email || data.phone ? 'mt-5' : ''
          }`}
        >
          <H20>Business hours</H20>
          <div className={'grid gap-4'}>
            {hours.map((args) => (
              <WorkHoursRow key={args.weekday} {...args} />
            ))}
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}
