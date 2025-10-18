import { useEffect, useState } from 'react'

import {
  APP_STORE_URL,
  APPLE_STORE_INSTALL,
  GOOGLE_PLAY_INSTALL,
  GOOGLE_PLAY_URL,
} from '@/core/consts/common'

export const useStoreLinks = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768) // Tablet and below
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleAppStoreClick = () => {
    window.open(isMobile ? APP_STORE_URL : APPLE_STORE_INSTALL, '_blank')
  }

  const handlePlayStoreClick = () => {
    window.open(isMobile ? GOOGLE_PLAY_URL : GOOGLE_PLAY_INSTALL, '_blank')
  }

  // This is used for the mobile version of the message button on the profile card
  const handleStoreClick = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      window.open(APPLE_STORE_INSTALL, '_blank')
    } else if (isAndroid) {
      window.open(GOOGLE_PLAY_INSTALL, '_blank')
    } else {
      window.open(APP_STORE_URL, '_blank')
    }
  }
  return {
    isMobile,
    handleStoreClick,
    handleAppStoreClick,
    handlePlayStoreClick,
  }
}
