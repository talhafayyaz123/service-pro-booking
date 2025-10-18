import { useLayoutEffect, useState } from 'react'

const queries = [
  '(max-width: 575px)',
  '(min-width: 576px) and (max-width:767px)',
  '(min-width: 768px) and (max-width:1060px)',
  '(min-width: 1061px) and (max-width:1280px)',
  '(min-width: 1281px) and (max-width:1536px)',
  '(min-width: 1537px) and (max-width:1920px)',
  '(min-width:1920px)',
]

export const useMediaScreen = () => {
  const [isSmall, isTablet, isLaptop, isDesktop, isLargeDesktop, isHr] =
    useMatchMedia(queries)
  return { isSmall, isTablet, isLaptop, isDesktop, isLargeDesktop, isHr }
}

export const useMatchMedia = (
  queries: IMediaQuery,
  defaultValues: IMatchedMedia = []
): IMatchedMedia => {
  const initialValues = defaultValues.length
    ? defaultValues
    : Array(queries.length).fill(false)
  const mediaQueryLists = queries.map((q): any =>
    typeof window !== 'undefined' ? window.matchMedia(q) : { matches: false }
  )

  const getValue = (): IMatchedMedia => {
    return mediaQueryLists.map((mql) => mql.matches)
  }

  const [value, setValue] = useState(getValue)

  useLayoutEffect(() => {
    const handler = (): void => setValue(getValue)
    mediaQueryLists.forEach((mql) => mql?.addListener(handler))
    return () => mediaQueryLists.forEach((mql) => mql?.removeListener(handler))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (typeof window === 'undefined') {
    return initialValues
  } else {
    return value
  }
}

type IMediaQuery = Array<string>

type IMatchedMedia = Array<boolean>
