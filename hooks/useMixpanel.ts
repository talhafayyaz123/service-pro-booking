import { Mixpanel } from '@/lib/mixpanel'
import { MixpanelEvent, MixpanelEventProperties } from '@/types/mixpanel'

const useMixpanel = () => {
  const trackEvent = (
    event: MixpanelEvent,
    properties?: MixpanelEventProperties
  ) => {
    Mixpanel.track(event, properties)
  }

  const trackPageViewEvent = (properties?: MixpanelEventProperties) => {
    Mixpanel.track_pageview(properties)
  }

  // Identify a user with a unique ID
  const identifyUser = (userId: string) => {
    Mixpanel.identify(userId)
  }

  // Set user profile properties
  const setUserProperties = (properties: Record<string, any>) => {
    Mixpanel.people.set(properties)
  }
  // console.log('abcd use')
  return {
    trackEvent,
    trackPageViewEvent,
    identifyUser,
    setUserProperties,
  }
}

export default useMixpanel
