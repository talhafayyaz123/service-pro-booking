import { Transition } from '@headlessui/react'
import { ReactNode, useState } from 'react'

import { IconArrowLeft } from '@/assets/icons/icons'

export const Accordion = ({
  title,
  text,
  className,
  arrow = true,
  textClassName,
  titleClassName,
}: {
  title: ReactNode
  text: ReactNode
  className?: string
  textClassName?: string
  arrow?: boolean
  titleClassName?: string
}) => {
  const [open, setOpen] = useState(false)

  return (
    <div className={`${className} flex flex-col w-full flex-1`}>
      <div
        role={'button'}
        className={`cursor-pointer flex justify-between ${titleClassName}`}
        onClick={() => setOpen(!open)}
      >
        <div>{title}</div>
        {arrow && (
          <IconArrowLeft
            className={`${
              open ? 'rotate-90' : 'rotate-[-90deg]'
            } transition stroke-black`}
          />
        )}
      </div>
      <Transition
        show={open}
        enter="transition-opacity duration-150"
        enterFrom="opacity-0"
        enterTo="opacity-100 "
        leave="transition-opacity transition-height duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className={textClassName}>{text}</div>
      </Transition>
    </div>
  )
}
