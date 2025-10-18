import { useCallback, useEffect, useState } from 'react'

export const useIsScrollerTop = (height: number) => {
  const [visible, setVisible] = useState(false)
  const listner = useCallback(() => {
    const current = document.getElementById('scroll_section') || null
    if ((current?.scrollTop || 0) > height) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [height])

  useEffect(() => {
    document.addEventListener(
      'scroll',
      () => {
        listner()
      },
      true
    )
    return document.removeEventListener('scroll', () => listner(), true)
  }, [listner])

  return visible
}
