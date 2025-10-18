import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN as string
const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'
const enableTesting =
  process.env.NEXT_PUBLIC_ENABLE_MIXPANEL_TEST === 'true' || false
const isTesting = false

const isMixpanelEnabled = isTesting || enableTesting || isProduction

let isInitialized = false
if (
  isMixpanelEnabled &&
  typeof window !== 'undefined' &&
  MIXPANEL_TOKEN &&
  !isInitialized
) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: enableTesting,
    track_pageview: true, // Note: Replace with track events for page views manually.
  })
  isInitialized = true
} else if (isMixpanelEnabled && !MIXPANEL_TOKEN) {
  console.error('Mixpanel token is missing in production environment.')
}

export const Mixpanel = {
  track: (event: string, properties?: Record<string, any>) => {
    if (isMixpanelEnabled) {
      mixpanel.track(event, properties)
    }
  },
  identify: (id: string) => {
    if (isMixpanelEnabled) {
      mixpanel.identify(id)
    }
  },
  people: {
    set: (properties: Record<string, any>) => {
      if (isMixpanelEnabled) {
        mixpanel.people.set(properties)
      } else {
        console.warn(`[Mixpanel-dev] People Set Properties: `, properties)
      }
    },
  },

  track_pageview: (properties?: Record<string, any>) => {
    if (isMixpanelEnabled) {
      mixpanel.track_pageview(properties)
    } else {
      console.warn(`[Mixpanel-dev] Event Tracked:`, properties)
    }
  },

  // alias: (id: string) => {
  //   mixpanel.alias(id)
  // },
}
