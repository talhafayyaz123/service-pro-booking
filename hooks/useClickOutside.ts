import { MutableRefObject, useEffect } from 'react'

import { IMPORTANT_CLASS_NAMES } from '@/core/consts/common'

export const useClickOutside = (
  ref: MutableRefObject<HTMLElement | null>,
  callback: () => void,
  clickOutside = true,
  closeInModal?: boolean
) => {
  useEffect(() => {
    if (typeof window !== 'undefined' && clickOutside) {
      const handleClick = (e: any) => {
        const modal = !closeInModal
          ? document.getElementsByClassName(
              IMPORTANT_CLASS_NAMES.UNCLOSE_CLASSNAME
            ).length !== 0
          : false

        if (ref.current && !ref.current.contains(e.target) && !modal) {
          callback && callback()
        }
      }
      document.addEventListener('click', handleClick, true)
      return () => {
        document.removeEventListener('click', handleClick, true)
      }
    }
  })
}
