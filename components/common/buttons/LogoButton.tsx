import Link from 'next/link'

import { IconMainLogo } from '@/assets/icons/icons'
import { H18 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'

export const LogoButton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-center gap-3 ${className}`}
    >
      <IconMainLogo className={'flex-shrink-0'} />
      <Link href={ROUTES.home}>
        <a>
          <H18 className={'!font-bold maxTablet:text-16 mb-[-3px]'}>
            READYHUBB
          </H18>
        </a>
      </Link>
    </div>
  )
}

export const LogoButtonSubdomain = ({ className }: { className?: string }) => {
  const link = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  return (
    <div
      className={`cursor-pointer flex items-center justify-center gap-3 ${className}`}
    >
      <IconMainLogo className={'flex-shrink-0'} />
      <Link href={link}>
        <a rel="noopener noreferrer" href={link ?? '/'}>
          <H18 className={'!font-bold maxTablet:text-16 mb-[-3px]'}>
            READYHUBB
          </H18>
        </a>
      </Link>
    </div>
  )
}

export const OnlyLogoButton = ({ className }: { className?: string }) => {
  return (
    <div
      className={`cursor-pointer flex items-center justify-center gap-3 ${className}`}
    >
      <Link href={ROUTES.home}>
        <a>
          <IconMainLogo className={'flex-shrink-0'} />
        </a>
      </Link>
    </div>
  )
}
