import { ReactNode, useMemo } from 'react'

import { H16 } from '@/components/typography'

export const ContactCard = ({
  className,
  icon,
  type,
  contacts,
}: {
  className?: string
  icon: ReactNode
  type: 'tel' | 'mail'
  contacts: string
}) => {
  const types = useMemo(
    () => ({
      tel: {
        href: `tel:${contacts}`,
        buttonText: 'Call',
      },
      mail: {
        href: `mailto:${contacts}`,
        buttonText: 'Email',
      },
    }),
    [contacts]
  )
  return (
    <a href={types[type].href}>
      <div
        className={`border border-lightGray rounded-[12px]  p-4.5 ${className}`}
      >
        <div className={'grid grid-cols-[auto_1fr_auto] items-center gap-4'}>
          {icon}
          <div className={'overflow-hidden '}>
            <H16 className={'block truncate'}>{contacts}</H16>
          </div>
        </div>
        <H16 color={'text-orange'} className={' !font-bold'}>
          {types[type].buttonText}
        </H16>
      </div>
    </a>
  )
}
