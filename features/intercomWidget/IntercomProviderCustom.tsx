import debounce from 'lodash/debounce'
import { ReactNode, useEffect } from 'react'
import { IntercomProvider, useIntercom } from 'react-use-intercom'

import { useAppSelector } from '@/hooks/hooks'

const appId = process.env.NEXT_PUBLIC_INTERCOM_APP_ID || ''
const apiBase = process.env.NEXT_PUBLIC_API_BASE || ''

const BOOT_DELAY_MS = 1000

const IntercomProviderCustom = ({ children }: { children: ReactNode }) => {
  return (
    <IntercomProvider appId={appId} apiBase={apiBase}>
      <IntercomWidget />
      {children}
    </IntercomProvider>
  )
}

const IntercomWidget = () => {
  const me = useAppSelector((state) => state.me.me)
  const { boot, shutdown } = useIntercom()

  const debouncedBoot = debounce(async (userData: Record<string, any>) => {
    boot(userData)
  }, BOOT_DELAY_MS)

  useEffect(() => {
    // Clean up previous instance
    shutdown()

    if (me?.role === 'PRO' || me?.role === 'CLIENT') {
      const userData = {
        name: `${me?.firstName || ''} ${me?.lastName || ''}`.trim(),
        email: me?.email || '',
        createdAt: new Date().toLocaleString(),
        phone: me?.phoneCode && me?.phone ? `${me?.phoneCode}${me?.phone}` : '',
      }

      if (userData.email) {
        debouncedBoot(userData)
      }
    }

    // Cleanup on unmount or role change
    return () => {
      debouncedBoot.cancel() // Cancel any pending boots
      shutdown()
    }
  }, [
    boot,
    shutdown,
    me?.email,
    me?.firstName,
    me?.lastName,
    me?.phone,
    me?.phoneCode,
    me?.role,
  ])

  // Return null to prevent any DOM manipulation
  return null
}

export default IntercomProviderCustom
