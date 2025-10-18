import nookies from 'nookies'

const getNavigator = (): Navigator | null => {
  if (typeof window !== 'undefined') {
    if (window.navigator || navigator) {
      return window.navigator || navigator
    }
    return null
  }
  return null
}

export const isIOS = () => {
  const navigator = getNavigator()
  if (!navigator) {
    return false
  }
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  )
}

export const isAndroid = () => {
  const navigator = getNavigator()
  if (!navigator) {
    return false
  }
  return navigator.userAgent.includes('Android')
}

export const isMobile = () => {
  return (isIOS() || isAndroid()) && !isGoogleBot()
}

export const isGoogleBot = () => {
  const navigator = getNavigator()
  if (!navigator) {
    return false
  }
  return navigator.userAgent.includes('Googlebot')
}

export const onCloseOverflowScreen = () => {
  return nookies.set(undefined, 'isShowOverflow', 'true', {
    expire: 7 * 24 * 60 * 60 * 1000,
  })
}

export const isCloseOverflowScreen = () => {
  if (typeof window !== 'undefined') {
    return false
  }
  const isClose = nookies.get(undefined, 'isShowOverflow')
  return !!isClose?.isShowOverflow
}
