import { RefObject } from 'react'

export const isFullVisibility = (ref?: RefObject<HTMLDivElement>): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const boundingClient = ref?.current?.getBoundingClientRect() || {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
  const targetPosition = {
    bottom: window.pageYOffset + boundingClient?.bottom,
    top: window.pageYOffset + boundingClient?.top,
    left: window.pageXOffset + boundingClient?.left,
    right: window.pageXOffset + boundingClient?.right,
  }

  const isScrollingTop = targetPosition.top > 100
  const isScrollingBottom =
    (ref?.current?.offsetTop || 0) > targetPosition.bottom

  return isScrollingTop && isScrollingBottom
}
