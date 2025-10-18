import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'

export const API_LINKS = {
  login: '/v1/auth/login',
  home: '/',
  sendResetPassword: '/v1/auth/send/reset-password',
  resetPassword: '/v1/auth/reset-password',
  register: '/v1/auth/register',
  socialLogin: '/v1/auth/social',
  refreshToken: '/v1/auth/refresh',
  mainCategory: '/v1/business-types',
  sendPhoneVerification: '/v1/auth/send/verification',
  checkVerificationCode: '/v1/auth/verify',
  addUserCategories: '/v1/users/business-types',
  addProServices: '/v1/services/onboarding',
  completeProfile: '/v1/auth/social/account',
  registerUpdate: '/v1/auth/register/update',
  checkEmail: '/v1/auth/register/check-email',
  proTax: '/v1/pros/tax-percent',
  favoriteInspiration: (id: string) => `/v1/inspirations/${id}/favorite`,
}

export const UPLOAD_IMG_LINK = '/v1/utils'
export const UPLOAD_FILE_LINK = '/v1/file-uploader/image'
export const API_TIPS = (id: string) => `/v1/bookings/${id}/tips`
export const API_POST_REVIEW = (proId: string, bookingId: string) =>
  `/v1/reviews/pro/${proId}/booking/${bookingId}`

export const API_ONBOARDING = {
  getAllOnboarding: '/v1/pros/onboarding',
  additionalInfo: '/v1/pro/onboarding/additional-info',
  proAvailability: '/v1/pro/onboarding/pro-availabilities-v2',
  birthday: '/v1/pros/birthday',
  mainCategory: '/v1/pro/onboarding/main-business-type',
  additionalCategory: '/v1/pro/onboarding/additional-business-types',
  proFaqa: '/v1/pro/onboarding/faq',
  termsOfPayment: '/v1/pro/onboarding/terms-of-payment',
  proContacts: '/v1/pro/onboarding/pro-contacts',
  setupBusiness: '/v1/pro/onboarding/business-details',
  proServices: '/v1/services',
  check: '/v1/pros/onboarding/check',
  check2: '/v1/pros/onboarding/check-v2',
  basicInfo: '/v1/pro/onboarding/basic-info',
  businessTypesStep: '/v1/pro/onboarding/business-types',
  businessDetailStep: '/v1/pro/onboarding/business-details',
  businessTypes: '/v1/business-types',
  serviceSuggestions: '/v1/admin/service-suggestions',
  validateRestrictedWord: 'v1/admin/inspiration-search/validate',
}

export const API_PROFILE = {
  getProById: (id: string) => `/v1/pros/${id}`,
  getProServicesById: (id: string) => `/v1/services/pro/${id}`,
  getAboutPro: (id: string) => `/v1/pros/${id}/about`,
  getSimilarPro: (id: string) => `/v1/pros/similar/${id}`,
  getRatingProById: (id: string) => `/v1/reviews/pro/${id}/rating`,
  getReviewsProById: (id: string) => `/v1/reviews/pro/${id}`,
  getTermsOfPaymentById: (id: string) => `/v1/pros/${id}/terms-of-payment`,
}
export const API_INSPIRATION = {
  getAll: '/v1/inspirations',
  getAllFollowing: '/v1/inspirations/following',
  getAllBlogPosts: '/v1/blog/posts',
  my: '/v1/inspirations/my',
  byId: (id: string) => `/v1/inspirations/pro/${id}`,
  getById: (id: string) => `/v1/inspirations/${id}`,
  follow: (id: string) => `/v1/inspirations/${id}/follow`,
  unfollow: (id: string) => `/v1/inspirations/${id}/unfollow`,
}

export const API_SEARCH = {
  // @NOTE: deprecated
  // getHistory: '/v1/search/history',
  // search: '/v1/search/raw',
  searchV2: '/v1/search-v2',
}

export const API_HOMEPAGE = {
  recent: '/v1/pros/recent',
  // @NOTE: deprecated
  // nearestTopRated: getUrlWithSearchParams('/v1/search/raw', {
  //   topRated: true,
  //   // nearest: true,
  // }),
  nearestTopRated: getUrlWithSearchParams('/v1/search-v2', {
    topRated: true,
    // nearest: true,
  }),
  // @NOTE: deprecated
  // topRated: getUrlWithSearchParams('/v1/search/raw', {
  //   topRated: true,
  // }),
  topRated: getUrlWithSearchParams('/v1/search-v2', {
    topRated: true,
  }),
}

export const API_BOOKING = {
  getServices: (proId: string) => `/v1/services/pro/${proId}`,
  getWindows: '/v1/bookings/window-v2',
  getPeriodWindows: '/v1/bookings/period-windows',
  booking: '/v1/bookings',
  bookingV2: '/v2/bookings-v2',
  bookingV2Bnpl: '/v2/bookings-v2/bnpl',
  paymentIntentBNPL: '/v2/bookings-v2/bnpl/payment-intent',
  confirmBNPL: '/v2/bookings-v2/bnpl/confirm',
  prepareBnpl: '/v1/bookings/prepare-bnpl',
  getDeposit: (proId: string) => `/v1/pros/${proId}/terms-of-payment`,
  getSingleBooking: (id: string) => `/v1/bookings/${id}`,
  addons: (proId: string) => `/v1/pros/${proId}/addons`,
}

export const API_PAYMENT = {
  getSavedCards: '/v1/payments/cards',
  createSetupIntent: '/v1/payments/setup-intent',
  makeBookingPayment: (bookingId: string) => `/v1/payments/${bookingId}`,
  verifyBookingPayment: (bookingId: string) =>
    `/v1/payments/${bookingId}/verify`,
  createPaymentIntent: '/v1/payments/create-payment-intent',
  saveUserCard: '/v1/payments/cards',
  deleteUserCard: (id: string) => `/v1/payments/cards/${id}`,
  bookingPdfInvoice: (bookingId: string) =>
    `/v1/bookings/${bookingId}/invoice.pdf`,
  transactionInvoice: (bookingId: string, transactionId: string) =>
    `/v1/bookings/${bookingId}/transactions/${transactionId}/invoice.pdf`,
  refundPdfInvoice: (refundId: string) =>
    `/v1/payments/${refundId}/invoice-refund`,
}

export const API_USER = {
  me: '/v1/users/me',
  removeAcc: '/v1/auth/remove',
  checkPassword: '/v1/auth/verify/password',
  favorites: '/v1/pros/favorite',
  patchUser: '/v1/users',
  notifications: '/v1/users/notifications',
  changePassword: '/v1/auth/update-password',
  updateIcon: '/v1/users/icon',
  proCurrency: '/v1/users/currency',
  unsubscribe: '/v1/subscriptions',
  cancelSubscribePlanned: '/v1/subscriptions/planned',
  freshdesk: '/v1/freshdesk',
  listedCheck: '/v1/pro/onboarding/listed-check',
}
