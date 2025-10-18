import { ISubscriptionCancellationReason } from '@/types/common'

export enum MODALS_TYPE {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
  UPLOAD_PICTURE = 'UPLOAD_PICTURE',
  VIEW_UPLOADED_PICTURE = 'VIEW_UPLOADED_PICTURE',
  CLIENT_ADD_PROFILE_INFO = 'CLIENT_ADD_PROFILE_INFO',
  ADD_OR_EDIT_CATEGORY = 'ADD_OR_EDIT_CATEGORY',
  REMOVE_CATEGORY = 'REMOVE_CATEGORY',
  REMOVE_CATEGORY_WARNING = 'REMOVE_CATEGORY_WARNING',
  BUSINESS_HOURS = 'BUSINESS_HOURS',
  COPY_BUSINESS_HOURS = 'COPY_BUSINESS_HOURS',
  PRO_SERVICES = 'PRO_SERVICES',
  FAQ_SECTION = 'FAQ_SECTION',
  MAIN_PAGE_ALL_CATEGORIES = 'MAIN_PAGE_ALL_CATEGORIES',
  BOOKING_SELECT_DATE = 'BOOKING_SELECT_DATE',
  CHOOSE_SERVICE = 'CHOOSE_SERVICE',
  SIGN_UP_TO_CONFIRM = 'SIGN_UP_TO_CONFIRM',
  // BOOKING_SUCCESS_MODAL = 'BOOKING_SUCCESS_MODAL',
  BOOKING_PENDING_MODAL = 'BOOKING_PENDING_MODAL',
  BOOKING_RESCHEDULE_SUCCESS_MODAL = 'BOOKING_RESCHEDULE_SUCCESS_MODAL',
  USER_PROFILE_ASK_A_QUESTION = 'USER_PROFILE_ASK_A_QUESTION',
  BOOKINGS_CANCEL_BOOKING = 'BOOKINGS_CANCEL_BOOKING',
  BOOKINGS_LEAVE_A_REVIEW = 'BOOKINGS_LEAVE_A_REVIEW',
  BOOKINGS_RESCHEDULE = 'BOOKINGS_RESCHEDULE',
  BOOKINGS_REPORT_PROBLEM = 'BOOKINGS_REPORT_PROBLEM',
  SETTINGS_CHANGE_NAME = 'SETTINGS_CHANGE_NAME',
  SETTINGS_CHANGE_EMAIL = 'SETTINGS_CHANGE_EMAIL',
  SETTINGS_CHANGE_PASSWORD = 'SETTINGS_CHANGE_PASSWORD',
  SETTINGS_CHANGE_PHONE_NUMBER = 'SETTINGS_CHANGE_PHONE_NUMBER',
  SETTINGS_CHANGE_DELETE_ACCOUNT = 'SETTINGS_CHANGE_DELETE_ACCOUNT',
  SETTINGS_CHANGE_LOG_OUT = 'SETTINGS_CHANGE_LOG_OUT',
  SETTINGS_CHANGE_PREFERRED_CATEGORIES = 'SETTINGS_CHANGE_PREFERRED_CATEGORIES',
  FORGOT_PASSWORD_SUCCESS = 'FORGOT_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS',
  UNSUBSCRIPTION_MODAL = 'UNSUBSCRIPTION_MODAL',
  CHANGE_BILLING = 'CHANGE_BILLING',
  BILLING_DETAILS = 'BILLING_DETAILS',
  CHANGE_PAYMENT_METHOD = 'CHANGE_PAYMENT_METHOD',
  ADJUST_BOOKING_SETTINGS = 'ADJUST_BOOKING_SETTINGS',
  UPGRADE_SUBSCRIPTION_MODAL = 'UPGRADE_SUBSCRIPTION_MODAL',
  CONTINUE_IN_APP_BANNER = 'CONTINUE_IN_APP_BANNER',
  ADD_TYPE_OF_BUSINESS = 'ADD_TYPE_OF_BUSINESS',
  REMOVE_SAVED_CARD = 'REMOVE_SAVED_CARD',
  LOCATION_ACCESS_WARNING = 'LOCATION_ACCESS_WARNING',
  BOOKING_TERMS_WARNING = 'BOOKING_TERMS_WARNING',
  ASK_A_QUESTION = 'ASK_A_QUESTION',
  LEAVE_A_REVIEW_SUCCESS = 'LEAVE_A_REVIEW_SUCCESS',
  SHARE_SOCIAL_BOTTOMSHEET = 'SHARE_SOCIAL_BOTTOMSHEET',
  GET_LISTED_MODAL = 'GET_LISTED_MODAL',
  FORM_TEMPLATE_MODAL = 'FORM_TEMPLATE_MODAL',
  VIEW_BOOKINGS_FORM_TEMPLATE_MODAL = 'VIEW_BOOKINGS_FORM_TEMPLATE_MODAL',
  PROFILE_IMAGE_PREVIEW_MODAL = 'PROFILE_IMAGE_PREVIEW_MODAL',
  ADDONS_MODAL = 'ADDONS_MODAL',
  ADDRESS_ELEMENTS_MODAL = 'ADDRESS_ELEMENTS_MODAL',
  DELETE_SELECT_ADDON_MODAL = 'DELETE_SELECT_ADDON_MODAL',
  CANCEL_SUBSCRIPTION_MODAL = 'CANCEL_SUBSCRIPTION_MODAL',
  CANCEL_SUBSCRIPTION_REASON_MODAL = 'CANCEL_SUBSCRIPTION_REASON_MODAL',
  PAYMENT_LINK_INFO_MODAL = 'PAYMENT_LINK_INFO_MODAL',
  VIEW_PROFILE_IMAGE_MODAL = 'VIEW_PROFILE_IMAGE_MODAL',
  MESSAGE_PRO_MODAL = 'MESSAGE_PRO_MODAL',
}

export const IMPORTANT_CLASS_NAMES = {
  UNCLOSE_CLASSNAME: 'UNCLOSE_CLASSNAME',
}
export const INVITE_REFFERAL_LINK = 'https://readyhubblink.page.link/get'
export const INVITE_REFFERAL_LINK_VIEW = 'readyhubblink.page.link/get'
export const USER_ROLES = {
  client: 'CLIENT',
  pro: 'PRO',
}

export const COMPANY_CALL = 'https://calendly.com/readyhubb'
export const COMPANY_EMAIL = 'hello@readyhubb.com'
export const COMPANY_INSTAGRAM = 'https://instagram.com/readyhubb'
export const COMPANY_FACEBOOK = 'https://facebook.com/readyhubb'
export const COMPANY_TWITTER = 'https://twitter.com/readyhubb'
export const COMPANY_TIKTOK = 'https://www.tiktok.com/@readyhubb'

export const BECOME_A_PRO_WEBSITE_URL = 'https://pro.readyhubb.com/'
export const GOOGLE_PLAY_INSTALL =
  'https://play.google.com/store/apps/details?id=com.readyhubb'
export const APPLE_STORE_INSTALL =
  'https://apps.apple.com/us/app/readyhubb/id1619297519'
export const GOOGLE_PLAY_URL =
  'https://readyhubblink.page.link/install-from-web'
export const APP_STORE_URL = 'https://readyhubblink.page.link/install-from-web'

export const locationDefaultHeaders = {
  lat: 'X-Info-Latitude',
  lng: 'X-Info-Longitude',
}

export const categoriesColors = [
  '#FDD7C2',
  '#F5F1E7',
  '#D8EBCF',
  '#CAE5BC',
  '#D4E5A1',
  '#C7E4CE',
  '#ABE0E4',
  '#FFE1EB',
  '#BCE2D7',
  '#D9F1FD',
  '#BFDFF6',
  '#C6D7E1',
  '#C6E9E3',
  '#C1C5E8',
  '#FFE1E9',
  '#DEDDEF',
  '#E9D1E1',
  '#FAE4EF',
  '#F7BDCB',
  '#E9C2C7',
  '#FBC1B3',
  '#FEBE8E',
  '#FFEAAB',
  '#C4F0F1',
]

export const CLIENT_DOWNLOAD_BANNER_COOKIE = 'CLIENT_DOWNLOAD_BANNER_COOKIE'
export const SEARCH_LIMIT = 40
export const OTP_TIMEFRAME = 300

export const SUBSCRIPTION_CANCELLATION_REASONS: ISubscriptionCancellationReason[] =
  [
    {
      id: 1,
      reason: 'The app lacks the necessary features required for my business',
      optionalFeedbackQuestion: 'What features are missing?',
    },
    {
      id: 2,
      reason: 'Encountered technical issues while using the Readyhubb app',
      optionalFeedbackQuestion:
        'What technical difficulties did you experience?',
    },
    {
      id: 3,
      reason: 'My clients have provided negative feedback regarding the app',
    },
    {
      id: 4,
      reason:
        'Struggled with integrating Readyhubb into my existing workflow or software',
    },
    {
      id: 5,
      reason:
        "The app didn't promote my business or bring me any new customers as expected",
    },
    {
      id: 6,
      reason:
        "I've shifted my career focus and no longer work as a service provider",
    },
    {
      id: 7,
      reason: 'Experienced unsatisfactory customer support from Readyhubb',
    },
    {
      id: 8,
      reason:
        'Found the user interface of Readyhubb to be confusing or challenging to navigate',
    },
    {
      id: 9,
      reason: "I'm transitioning to the free plan offered by Readyhubb",
    },
    {
      id: 10,
      reason:
        "The cost of the Readyhubb PRO plan is prohibitive; I'm opting for a more economical",
    },
    {
      id: 11,
      reason:
        "I'm opting for a different booking site as I prefer its features; switching to      another option",
    },
    {
      id: 12,
      reason: 'Other option',
      optionalFeedbackQuestion: 'Write other options',
    },
  ]

export enum DEPOSIT_TYPE {
  PERCENT_OF_SERVICE = 'PERCENT_OF_SERVICE',
  FULL_PRICE = 'FULL_PRICE',
  FIXED = 'FIXED',
}

export const AUTHORIZED_PRO_DATA = 'AUTHORIZED_PRO_DATA'
export const AUTHORIZED_CLIENT_DATA = 'AUTHORIZED_CLIENT_DATA'

export const PRO_ACCOUNT_EMAIL = 'PRO_ACCOUNT_EMAIL'

export const SWITCHED_FROM_CLIENT = 'SWITCHED_FROM_CLIENT'

export enum EImageType {
  SERVICES = 'SERVICES',
  INSPIRATIONS = 'INSPIRATIONS',
  PORTFOLIOS = 'PORTFOLIOS',
  AVATAR = 'AVATAR',
  REVIEW = 'REVIEW',
  CUSTOM_PAGE_LOGO = 'CUSTOM_PAGE_LOGO',
  CUSTOM_PAGE_COVER = 'CUSTOM_PAGE_COVER',
  CUSTOM_FORM_IMAGE = 'CUSTOM_FORM_IMAGE',
}
