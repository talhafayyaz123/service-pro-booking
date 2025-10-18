import { useEffect } from 'react'

export const useHideScroll = (isOpen: boolean) => {
  useEffect(() => {
    const scroller = document.getElementById('scroll_section')

    if (typeof window !== 'undefined') {
      if (isOpen) {
        document.body?.style.setProperty('overflow', 'hidden')
        scroller?.style?.setProperty('overflow', 'hidden')
      } else {
        document.body?.style.setProperty('overflow', 'auto')
        scroller?.style?.setProperty('overflow', 'auto')
      }
    }
    return () => {
      document.body?.style.setProperty('overflow', 'auto')
      scroller?.style?.setProperty('overflow', 'auto')
    }
  }, [isOpen])

  useEffect(() => {
    return () => document.body?.style.setProperty('overflow', 'auto')
  }, [])
}
