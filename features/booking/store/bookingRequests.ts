import { createAsyncThunk } from '@reduxjs/toolkit'
import { Stripe, StripeElements } from '@stripe/stripe-js'
import { format, set } from 'date-fns'
import { zonedTimeToUtc } from 'date-fns-tz'
import { getSession } from 'next-auth/react'

import { createSetupIntent } from '@/api/payment/createSetupIntent'
import { getSavedCards } from '@/api/payment/getSavedCards'
import { saveUserCard } from '@/api/payment/saveUserCard'
import { getUserInfo } from '@/api/user/getUserInfo'
import { API_BOOKING } from '@/core/consts/apiLinks'
import { UserSourceTypeEnum } from '@/core/helpers/calculateDepositBE'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import {
  addServices,
  IAddOn,
  IBookingInitialState,
  IBookingPeriodWindow,
  IBookingWindow,
  setBookingErrorMessage,
  updatePaymentState,
  updatePaymentStatus,
} from '@/features/booking/store/bookingStore'
import { formAnswersForCreateSelector } from '@/features/customForm/store/selectors'
import { IProfileServices } from '@/features/profile/profileType'
import { getProfileProByIdThunk } from '@/features/profile/store/profileRequests'
import { billingDataSelector } from '@/store/billingMethodsStore/billingMethodsSlice'
import { universalInstance } from '@/store/instance'
import { setModal } from '@/store/modals/modalsSlice'
import { RootStateType } from '@/store/rootStore'
import { IBookingPro } from '@/types/booking'
import { ITermsOfPayment } from '@/types/common'

import { checkIsPayBnpl, checkIsPayWithCard } from '../bookingHelpers'
import { PAYMENT_METHODS } from '../confirmBooking/PaymentDropdown'

interface IGetChosenServices {
  proId: string
  servicesId?: string[]
}

export const getChooseServiceForBooking = createAsyncThunk(
  'getChooseServiceForBooking',
  async ({ proId, servicesId }: IGetChosenServices, { dispatch }) => {
    const instance = await universalInstance()

    const response = await instance.get<IProfileServices>(
      API_BOOKING.getServices(proId),
      {}
    )

    dispatch(getProfileProByIdThunk(proId))
    dispatch(getTermsOfPaymentByPro(proId))
    const selectedServices = response.data.categoriesBlock
      .map((e) => e.categories)
      .flat()
      .filter((el) => {
        return servicesId?.includes(el?.id as string)
      })

    selectedServices.length && dispatch(addServices(selectedServices))
    return response
  }
)

export const getTermsOfPaymentByPro = createAsyncThunk(
  'getTermsOfPaymentByPro',
  async (proId: string) => {
    const instance = await universalInstance()

    const { data } = await instance.get<Partial<ITermsOfPayment>>(
      API_BOOKING.getDeposit(proId)
    )
    return data
  }
)

export const getBookingDateWindow = createAsyncThunk(
  'getBookingDateWindow',
  async (data: {
    bookDate: string | null
    time: number
    proId: string
    bookingId?: string
  }) => {
    const instance = await universalInstance()

    return await instance.get<IBookingWindow>(
      getUrlWithSearchParams(API_BOOKING.getWindows, data)
    )
  }
)

export const getPeriodWindows = createAsyncThunk(
  'getPeriodWindows',
  async (data: {
    fromDate: string | null
    toDate: string | null
    duration: number
    proId: string
  }) => {
    const instance = await universalInstance()

    return await instance.get<{ results: IBookingPeriodWindow[] }>(
      getUrlWithSearchParams(API_BOOKING.getPeriodWindows, data)
    )
  }
)

interface IBookingService {
  id: string
  name: string
  price: number
}

interface IBookingCreationResponse {
  id: string
  date: string
  comment: string | null
  address: string
  services: IBookingService[]
  pro: IBookingPro
  status?: string
}
interface IBNPLPaymentIntentResponse {
  clientSecret: string
  customerId: string
  result?: boolean
}

interface ITransformBookingDataArgs {
  bookingState: IBookingInitialState
  proId: string
  cardId?: string
  paymentMethodId?: string
  setupIntentId?: string
  timezone: string
  formAnswers?: any[]
  addons?: string[]
  paymentIntentId?: string
  services?: string[]
  payment?: string
  date?: string
  useWallet: boolean
  source?: keyof typeof UserSourceTypeEnum
}
interface ITransformBNPLBookingDataArgs {
  bookingState: IBookingInitialState
  proId: string
  cardId?: string
  paymentMethodId?: string
  setupIntentId?: string
  timezone: string
  formAnswers?: any[]
  addons?: string[]
  paymentIntentId?: string
  paymentMethod: 'KLARNA' | 'AFTERPAY' | 'AFFIRM'
  services?: string[]
  payment?: string
  date?: string
  useWallet: boolean
  source?: keyof typeof UserSourceTypeEnum
}
interface ITransformKlarnaBookingDataArgs {
  useWallet: boolean
  paymentMethod: string
  paymentIntentId: string
  services: string[] // List of services (service IDs)
  date: string // Booking date (as a string)
  proId: string // Professional ID (you can provide it dynamically)
  formAnswers: any[]
}

const transformBookingBody = ({
  proId,
  cardId,
  timezone,
  bookingState,
  setupIntentId,
  paymentIntentId,
  paymentMethodId,
  addons,
  services,
  payment,
  date,
  useWallet,
  source,
}: ITransformBookingDataArgs) => {
  const time = (
    bookingState.data.startTime?.value?.toString().split(':') || ['', '']
  ).map((el) => +el)

  const paymentMethod =
    payment || bookingState.data.paymentMethod?.value || 'DEPOSIT_IS_OFF'

  const _date = new Date(bookingState.data.date as Date)
  const bookingYear = _date.getFullYear()
  const bookingMonth = _date.getMonth()
  const bookingDay = _date.getDate()

  return {
    date:
      date ||
      zonedTimeToUtc(
        format(
          set(new Date(), {
            year: bookingYear,
            month: bookingMonth,
            date: bookingDay,
            hours: time[0],
            minutes: time[1],
          }),
          'yyyy-MM-dd HH:mm:ss'
        ),
        timezone
      ).toISOString(),
    proId,
    cardId,
    setupIntentId,
    addons,
    paymentMethod,
    paymentMethodId,
    paymentIntentId,
    address: bookingState.data.address,
    comment: bookingState.data.comment,
    latitude: bookingState.data.location?.lat,
    longitude: bookingState.data.location?.lng,
    services: services || bookingState.addedServices.map((el) => el.id),
    useWallet,
    source,
  }
}

export const createBooking = async ({
  formAnswers,
  ...rest
}: ITransformBookingDataArgs) => {
  const instance = await universalInstance()
  const bookingBody = transformBookingBody(rest)

  const { data } = await instance.post<IBookingCreationResponse>(
    API_BOOKING.bookingV2,
    { ...bookingBody, formAnswers }
  )
  return data
}
export const createBookingBNPLV2 = async ({
  formAnswers,
  paymentMethod,
  ...rest
}: ITransformBNPLBookingDataArgs) => {
  const instance = await universalInstance()
  const bookingBody = transformBookingBody(rest)

  const { data } = await instance.post<IBookingCreationResponse>(
    API_BOOKING.bookingV2Bnpl,
    { ...bookingBody, paymentMethod, formAnswers }
  )
  return data
}
export const BNPLPaymentIntent = async ({
  bookingId,
  ...rest
}: {
  bookingId: string
}) => {
  const instance = await universalInstance()
  // const bookingBody = transformBookingBody(rest)

  const { data } = await instance.post<IBNPLPaymentIntentResponse>(
    API_BOOKING.paymentIntentBNPL,
    { ...rest, bookingId }
  )
  return data
}

export const ConfirmBNPL = async ({
  bookingId,
  paymentIntentId,
  ...rest
}: {
  bookingId: string
  paymentIntentId: string
}) => {
  const instance = await universalInstance()
  // const bookingBody = transformBookingBody(rest)

  const { data } = await instance.post<IBNPLPaymentIntentResponse>(
    API_BOOKING.confirmBNPL,
    { ...rest, bookingId, paymentIntentId }
  )
  return data
}
// payment-intent
export const createBnplBooking = async ({
  paymentMethod,
  paymentIntentId,
  useWallet,
  date,
  proId,
  services,
  formAnswers,
}: ITransformKlarnaBookingDataArgs) => {
  const instance = await universalInstance()
  const bookingBody = {
    paymentMethod,
    paymentIntentId,
    useWallet,
    date,
    proId,
    services,
    formAnswers,
  }
  const { data } = await instance.post<IBookingCreationResponse>(
    API_BOOKING.bookingV2Bnpl,
    { ...bookingBody }
  )
  return data
}

interface IBookingRequest {
  proId: string
  stripe: Stripe | null
  elements: StripeElements | null
  deposit: number
  useWallet: boolean
  source?: keyof typeof UserSourceTypeEnum
  setBnplLoading?: (loading: boolean) => void
  openSuccessModal: () => void
}

export const confirmBookingRequest = createAsyncThunk(
  'confirmBookingRequest',
  async (
    {
      elements,
      stripe,
      deposit,
      proId,
      useWallet,
      source,
      setBnplLoading,
      openSuccessModal,
    }: IBookingRequest,
    { dispatch, getState }
  ) => {
    const rootState = getState() as RootStateType
    const bookingState = rootState.booking
    const proAbout = rootState.profile.about
    const timezone = proAbout.data?.timezone as string
    const allAddedAddons = rootState.booking.addOns.selectedIds

    const paymentMethod = bookingState.data.paymentMethod?.value
    const isCardPay = checkIsPayWithCard(paymentMethod)
    const isPaybnpl = checkIsPayBnpl(paymentMethod)
    const paymentOption = bookingState.payment?.paymentOption
    const selectedCard = bookingState.payment.selectedCard
    const formAnswers = formAnswersForCreateSelector(rootState)
    const billing_details = billingDataSelector(rootState)

    try {
      if (isCardPay || deposit || isPaybnpl) {
        if (selectedCard && !isPaybnpl) {
          const res = await createBooking({
            bookingState,
            proId,
            addons: allAddedAddons,
            cardId: selectedCard.id,
            timezone,
            formAnswers,
            useWallet,
            source,
          })
          dispatch(
            updatePaymentStatus({
              status: res?.status ?? '',
              bookingId: res?.id,
            })
          )
          openSuccessModal()
        } else {
          if (!elements || !stripe) {
            dispatch(setBookingErrorMessage('Unknown error, please try again.'))
            return
          }
          const PAYMENT_OPTIONS = {
            AFFIRM: stripe.confirmAffirmPayment,
            AFTERPAY: stripe.confirmAfterpayClearpayPayment,
            KLARNA: stripe.confirmKlarnaPayment,
          }

          if (isPaybnpl) {
            const path = window.location.href?.split('?')[0]
            const params = new URLSearchParams(window.location?.search)
            params.delete('payment_option')
            params.delete('payment_type')
            params.delete('payment_intent')
            params.delete('payment_intent_client_secret')
            params.set('payment_option', paymentOption as string)
            params.set('payment_type', PAYMENT_METHODS.PAY_IN_BNPL)
            params.set('useWallet', useWallet ? 'true' : 'false')
            if (allAddedAddons?.length > 0)
              params.set('addons', allAddedAddons?.join(','))
            if (bookingState.data.comment)
              params.set('comment', bookingState.data.comment)
            setBnplLoading?.(true)
            const session = await getSession()
            const time = (
              bookingState.data.startTime?.value?.toString().split(':') || [
                '',
                '',
              ]
            ).map((el) => +el)
            const _date = new Date(bookingState.data.date as Date)

            const bookingYear = _date.getFullYear()
            const bookingMonth = _date.getMonth()
            const bookingDay = _date.getDate()

            const date = zonedTimeToUtc(
              format(
                set(new Date(), {
                  year: bookingYear,
                  month: bookingMonth,
                  date: bookingDay,
                  hours: time[0],
                  minutes: time[1],
                }),
                'yyyy-MM-dd HH:mm:ss'
              ),
              timezone
            ).toISOString()

            params.set('date', date)
            params.set(
              'mainDate',
              format(
                set(new Date(), {
                  year: bookingYear,
                  month: bookingMonth,
                  date: bookingDay,
                  hours: time[0],
                  minutes: time[1],
                }),
                'yyyy-MM-dd HH:mm:ss'
              )
            )
            const resp = await createBookingBNPLV2({
              bookingState,
              proId,
              addons: allAddedAddons,
              timezone,
              formAnswers,
              useWallet,
              source,
              paymentMethod: paymentOption as 'AFFIRM' | 'AFTERPAY' | 'KLARNA',
            })
            dispatch(
              updatePaymentStatus({
                status: resp?.status ?? '',
                bookingId: resp?.id,
              })
            )
            sessionStorage.setItem(
              'paymentStatus',
              JSON.stringify({
                status: resp?.status ?? '',
                bookingId: resp?.id,
              })
            )

            const setupIntent = await BNPLPaymentIntent({
              bookingId: resp?.id,
            })
            dispatch(setModal({}))

            const me = await getUserInfo(session?.user?.accessToken as string)
            const billing = {
              email: me?.email,
              name: me?.firstName + ' ' + me?.lastName,
              address: {
                ...billing_details?.address,
                country: me?.countryCode as string,
              },
            }
            await PAYMENT_OPTIONS[
              paymentOption as 'AFFIRM' | 'AFTERPAY' | 'KLARNA'
            ](setupIntent?.clientSecret, {
              payment_method: {
                billing_details: billing,
              },
              shipping: {
                name: billing?.name,
                address: {
                  ...billing?.address,
                  line1: billing?.address?.line1 as string,
                },
              },
              return_url: `${path}?${params?.toString()}`,
            })
            sessionStorage.setItem(
              'paymentStatus',
              JSON.stringify({
                status: resp?.status ?? '',
                bookingId: resp?.id,
              })
            )
            setBnplLoading?.(false)
            dispatch(
              updatePaymentStatus({
                status: resp?.status ?? '',
                bookingId: resp?.id,
              })
            )
            return
          }

          const setupIntent = await createSetupIntent()
          const card = elements.getElement('cardNumber')
          if (card) {
            const response = await stripe.confirmCardSetup(
              setupIntent.clientSecret,
              {
                payment_method: {
                  card,
                  billing_details,
                },
              }
            )
            if (response.error) {
              dispatch(
                setBookingErrorMessage(
                  response.error.message ||
                    'Unknown error occurred, please try again.'
                )
              )
              return
            }
            if (response.setupIntent.status === 'succeeded') {
              const isDefault = rootState.billingMethods.isDefault

              await saveUserCard({
                isDefault,
                setupIntentId: response.setupIntent.id,
                paymentMethodId: response.setupIntent.payment_method as string,
              })
              // const res = await createBooking({
              //   bookingState,
              //   addons: allAddedAddons,
              //   proId,
              //   cardId: savedCard.id,
              //   timezone,
              //   formAnswers,
              //   useWallet,
              //   source,
              // })
              // dispatch(
              //   updatePaymentStatus({
              //     status: res?.status ?? '',
              //     bookingId: res?.id,
              //   })
              // )
              // openSuccessModal()
            } else {
              dispatch(
                setBookingErrorMessage('Unknown error, please try again.')
              )
            }
          }
        }
      } else {
        const res = await createBooking({
          bookingState,
          proId,
          timezone,
          formAnswers,
          addons: allAddedAddons,
          useWallet,
          source,
        })
        dispatch(
          updatePaymentStatus({
            status: res?.status ?? '',
            bookingId: res?.id,
          })
        )
        openSuccessModal()
      }
    } catch (err: any) {
      setBnplLoading?.(false)
      const error: string = err?.response?.data?.message
      dispatch(
        setBookingErrorMessage(error ?? 'Unknown error, please try again.')
      )
    }
  }
)

export const getUserSavedCards = createAsyncThunk(
  'getUserSavedCards',
  async (_: undefined, { dispatch }) => {
    const { data } = await getSavedCards()
    const defaultCard = data.cards.find((c) => c.isDefault)
    if (defaultCard) {
      dispatch(updatePaymentState({ selectedCard: defaultCard }))
    }
    return data.cards
  }
)
export const getAddonsFromProRequest = createAsyncThunk(
  'getAddonsFromProRequest',
  async ({ servicesIds, proId }: { servicesIds: string[]; proId: string }) => {
    const instance = await universalInstance()
    const { data } = await instance.get<IAddOn[]>(
      getUrlWithSearchParams(
        API_BOOKING.addons(proId),
        {
          serviceIds: servicesIds,
        },
        {}
      )
    )

    return data
  }
)
