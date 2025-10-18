import { TippyProps } from '@tippyjs/react'
import { ReactNode, useCallback, useMemo, useState } from 'react'

export const useSedibarMenuHelper = () => {
  const [showDropdown, setShowDropdown] = useState(false)

  const popperOptions = useMemo<TippyProps>(
    () => ({
      placement: 'bottom-end',
      interactive: true,
      animation: false,
      zIndex: 100,
      appendTo: window ? window.document.body : 'parent',
      onClickOutside: (_, event) => {
        event?.stopPropagation()
        setShowDropdown(false)
      },
    }),
    []
  )
  const handleClose = () => {
    setShowDropdown(false)
  }
  const handleControlClick = useCallback(() => {
    setShowDropdown((prev) => !prev)
  }, [])

  return {
    handleClose,
    popperOptions,
    showDropdown,
    handleControlClick,
  }
}

export interface IListItemProps {
  icon?: ReactNode
  label: ReactNode
  footerItemClassName?: string
  sideEffect?: () => void
  action?: () => void
  link?: string
}
