import Link from 'next/link'

import { IMGError404 } from '@/assets/images/images'
import { BackButton } from '@/components/common/buttons/BackButton'
import { Button } from '@/components/common/buttons/Button'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { H18, H48 } from '@/components/typography'
import { ROUTES } from '@/core/consts/routes'

export const ErrorCrash = () => {
  return (
    <div>
      <header className={'grid grid-cols-3 px-9 tablet:px-20 py-4 shadow-xl'}>
        <div>
          <BackButton className={'w-fit'} />
        </div>
        <LogoButton />
        <div />
      </header>
      <div className="flex flex-col justify-center text-center">
        <div className="max-w-[500px] mx-auto px-9 mt-20">
          <img src={IMGError404.src} alt="not found" className="mx-auto" />
        </div>
        <H48 className={'!font-bold mt-12'}>Server Crashed</H48>
        <H18
          className="mt-2"
          color="text-gray"
          dangerouslySetInnerHTML={{
            __html: 'We sincerely apologize for the incovenience',
          }}
        />

        <Link href={ROUTES.home}>
          <a className="block mx-auto mt-10">
            <Button buttonType="orange">Back to Home</Button>
          </a>
        </Link>
      </div>
    </div>
  )
}
