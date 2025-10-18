import { ReactNode } from 'react'

import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { cn } from '@/core/helpers/cn'

export const ResultConfigureCard = ({
  header,
  main,
  footer,
  warning,
  wrapperClassName,
  subWrapperClassName,
  headerWrapperClassName,
  mainWrapperClassName,
}: {
  header: ReactNode
  main: ReactNode
  footer: ReactNode
  warning?: ReactNode
  wrapperClassName?: string
  subWrapperClassName?: string
  headerWrapperClassName?: string
  mainWrapperClassName?: string
}) => {
  return (
    <CardWrapper
      className={`maxTablet:shadow-none maxTablet:pt-6 maxTablet:px-5 maxTablet:mt-10  h-fit p-0 ${wrapperClassName}`}
    >
      <CardWrapper
        className={`my-3 p-0 pb-5 pt-6 tablet:shadow-none tablet:m-0 tablet:p-0 ${subWrapperClassName}`}
      >
        <div
          className={cn(
            'border-b border-lightGray maxTablet:px-5 maxTablet:pb-4 px-10 tablet:pt-7 pb-6 flex justify-between',
            headerWrapperClassName
          )}
        >
          {header}
        </div>
        <div
          className={cn(
            'mx-10 my-4 tablet:my-5 maxTablet:mx-5 maxTablet:gap-6',
            mainWrapperClassName
          )}
        >
          {main}
          <div className="mt-4 border-t border-lightGray pt-7">{footer}</div>
          {warning}
        </div>
      </CardWrapper>
    </CardWrapper>
  )
}
