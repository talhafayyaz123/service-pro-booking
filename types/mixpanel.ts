export interface MixpanelEventProperties {
  [key: string]: any
}

export const MixpanelEvents = {
  pages: {
    onboarding: {
      WELCOME_SCREEN_WEB: 'WELCOME_SCREEN_WEB',
      PROMO_SCREEN_PROFESSIONAL: 'PROMO_SCREEN_PROFESSIONAL',
      SIGN_UP_PROFESSIONAL_SCREEN_WEB: 'SIGN_UP_PROFESSIONAL_SCREEN_WEB',
      SIGN_UP_FORM_PROFESSIONAL_WEB: 'SIGN_UP_FORM_PROFESSIONAL_WEB',
      OTP_VERIFICATION_SCREEN_WEB: 'OTP_VERIFICATION_SCREEN_WEB',
      ACCOUNT_CREATED_PRO_WEB: 'ACCOUNT_CREATED_PRO_WEB',
      Client_Role_Selected: 'Client_Role_Selected',
      Professional_Role_Selected: 'Professional_Role_Selected',
      ONBOARDING_INITIATED: 'ONBOARDING_INITIATED',
      HEAR_ABOUT_US: 'HEAR_ABOUT_US',
      Signup_With_Email_Client: 'Signup_With_Email_Client',
      Signup_With_Apple_Client: 'Signup_With_Apple_Client',
      Signup_With_Google_Client: 'Signup_With_Google_Client',
      Signup_With_Facebook_Client: 'Signup_With_Facebook_Client',
      Signup_With_Email_Pro: 'Signup_With_Email_Pro',
      Signup_With_Apple_Pro: 'Signup_With_Apple_Pro',
      Signup_With_Google_Pro: 'Signup_With_Google_Pro',
      Signup_With_Facebook_Pro: 'Signup_With_Facebook_Pro',
      Already_Have_Account_Client: 'Already_Have_Account_Client',
      Already_Have_Account_Pro: 'Already_Have_Account_Pro',
      BUSINESS_GENERAL_DETAILS_PAGE: 'BUSINESS_GENERAL_DETAILS_PAGE',
      BUSINESS_TYPE_PAGE: 'BUSINESS_TYPE_PAGE',
      BUSINESS_LOCATION_PAGE: 'BUSINESS_LOCATION_PAGE',
      BUSINESS_SERVICES_PAGE: 'BUSINESS_SERVICES_PAGE',
      PORTFOLIO_IMAGES_PAGE: 'PORTFOLIO_IMAGES_PAGE',
      BUSINESS_LISTED: 'BUSINESS_LISTED',
    },
  },
  actions: {
    onboarding: {
      ACCOUNT_NAME_USED: 'ACCOUNT_NAME_USED',
      HOME_BASE_SELECTED: 'HOME_BASE_SELECTED',
      VENUE_BASE_SELECTED: 'VENUE_BASE_SELECTED',
      MOBILE_BASE_SELECTED: 'MOBILE_BASE_SELECTED',
      VIRTUAL_BASE_SELECTED: 'VIRTUAL_BASE_SELECTED',
      CATEGORY_NAME_SELECTED: 'CATEGORY_NAME_SELECTED',
      NAME_MANUALLY_ENTERED: 'NAME_MANUALLY_ENTERED',
      SIGNUP_OTP_VERIFIED_SUCCESSFULLY: 'SIGNUP_OTP_VERIFIED_SUCCESSFULLY',
      SIGNUP_FAILED_OTP_ERROR: 'SIGNUP_FAILED_OTP_ERROR',
      SIGNUP_PASSWORD_FAILED_PRO: 'SIGNUP_PASSWORD_FAILED',
      CLIENT_REGISTERED_SUCCESS: 'CLIENT_REGISTERED_SUCCESS',
      PRO_REGISTERED_SUCCESS: 'PRO_REGISTERED_SUCCESS',
    },
    business_listing: {
      CURRENT_LOCATION_USED: 'CURRENT_LOCATION_USED',
      ADDRESS_MANUALLY: 'ADDRESS_MANUALLY',
    },
    booking: {
      NEW_BOOKING_CREATED: 'NEW_BOOKING_CREATED',
    },
    BUTTON_CLICKED: 'Button Clicked',
    PAGE_VIEWED: 'Page Viewed',
    FIRST_APP_OPEN: 'First App Open',
  },
} as const

export type MixpanelEvent = Extract<
  | typeof MixpanelEvents.pages.onboarding[keyof typeof MixpanelEvents.pages.onboarding]
  | typeof MixpanelEvents.actions.onboarding[keyof typeof MixpanelEvents.actions.onboarding]
  | typeof MixpanelEvents.actions.business_listing[keyof typeof MixpanelEvents.actions.business_listing]
  | typeof MixpanelEvents.actions.booking[keyof typeof MixpanelEvents.actions.booking]
  | typeof MixpanelEvents.actions[keyof typeof MixpanelEvents.actions],
  string
>
