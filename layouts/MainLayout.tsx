import classNames from 'classnames'
import { ReactNode } from 'react'

import Footer from '@/components/common/footer'
import { MainHeader } from '@/components/header/MainHeader'

interface Props {
  children: ReactNode
  hideOnMobile?: boolean
  topContent?: ReactNode
  footerClassName?: string
  id?: string
}

export const MainLayout = ({
  children,
  hideOnMobile,
  topContent,
  footerClassName,
  id,
}: Props) => {
  return (
    <div
      id={id}
      className={classNames(
        `h-full grid tablet:grid-rows-[auto_1fr_auto]`,
        { ['small:grid-rows-[auto_1fr_auto]']: hideOnMobile },
        { ['grid-rows-[auto_1fr_auto]']: !hideOnMobile }
      )}
    >
      {topContent}
      <MainHeader showBack hideOnMobile={hideOnMobile} />
      <div
        id="scroll_section"
        className="flex justify-between flex-grow flex-col overflow-y-auto !overflow-x-hidden"
      >
        <section data-testid={'children'} className={'flex-grow'}>
          {children}
        </section>
        <Footer footerClassName={footerClassName} />
      </div>
    </div>
  )
}
