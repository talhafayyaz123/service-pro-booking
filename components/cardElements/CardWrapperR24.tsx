import { LegacyRef, ReactNode } from 'react'

import { cn } from '@/core/helpers/cn'

export const CardWrapper = ({
  children,
  className,
  onClick,
  elemRef,
  id,
  omitRole = false, // New prop with a default value
}: {
  omitRole?: boolean
  children: ReactNode
  className?: string
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  elemRef?: LegacyRef<HTMLDivElement> | null
  id?: string
}) => {
  return (
    <div
      onKeyDown={(e) => {
        if (omitRole && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault() // Prevent scrolling when the space key is pressed
          onClick?.(
            e as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
          )
        }
      }}
      role={!omitRole ? 'none' : undefined} // Conditionally set role to 'none'
      tabIndex={omitRole ? 0 : undefined} // Allow focus only when omitRole is true
      id={id}
      ref={elemRef}
      onClick={(e) => onClick?.(e)}
      className={cn(
        'p-5 bg-white rounded-3xl overflow-hidden shadow-xl',
        className
      )}
    >
      {children}
    </div>
  )
}
