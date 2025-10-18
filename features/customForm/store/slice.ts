import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/dist/query/react'
import { getSession } from 'next-auth/react'

import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { IConvertableForm } from '@/features/customForm/types'
import { baseURL } from '@/store/instance'

export interface IInitialState {
  forms: IFormData[]
  templateForms: {
    data: ITemplateForm[]
    status: boolean
  }
}

export interface IFormData {
  status: IFormsStatus
  isRequiredForm: boolean
  id: string
  isTouched: boolean
  trySubmit: boolean
  clearClose: boolean
  data: IConvertableForm | null
}

export type IFormsStatus = 'notFilled' | 'error' | 'completed'

const initialState: IInitialState = {
  forms: [],
  templateForms: {
    data: [],
    status: false,
  },
}

const customFormSlice = createSlice({
  name: 'customFormSlice',
  initialState,
  reducers: {
    setInitialForms: (
      state,
      { payload }: PayloadAction<IInitialState['forms']>
    ) => {
      const mergedForms = payload.map((form) => {
        const findFormInCurrentState = state.forms.find(
          (existForm) => existForm.id === form.id
        )

        return findFormInCurrentState
          ? { ...findFormInCurrentState, isTouched: true }
          : form
      })

      state.forms = mergedForms
    },
    setTrySubmitAll: (state) => {
      state.forms = state.forms.map((el) => ({ ...el, trySubmit: true }))
    },
    setForm: (state, { payload }: PayloadAction<Partial<IFormData>>) => {
      state.forms = state.forms.map((form) =>
        form.id === payload.id ? { ...form, ...payload } : form
      )
    },
  },
})
export const { setForm, setInitialForms, setTrySubmitAll } =
  customFormSlice.actions
export const customForm = customFormSlice.reducer

export const customFormApi = createApi({
  reducerPath: 'customFormApi',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    prepareHeaders: async (headers) => {
      const session = await getSession()
      headers.set('accept', `application/json`)
      headers.set('Content-Type', `application/json`)
      headers.set('Authorization', `Bearer ${session?.user.accessToken}`)
      return await headers
    },
  }),

  endpoints: (build) => ({
    getCustomForm: build.query<
      ITemplateForm[],
      { proId: string; serviceIds?: string[] }
    >({
      query: ({ proId, serviceIds }) => {
        return {
          url: getUrlWithSearchParams(`/v1/pros/${proId}/custom-forms`, {
            serviceIds,
          }),
          method: 'GET',
        }
      },
      keepUnusedDataFor: 0,
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled
          await dispatch(
            setInitialForms(
              data.map((data) => ({
                status: 'notFilled',
                id: data.id || '',
                isTouched: false,
                data: null,
                isRequiredForm: data.isRequired || false,
                trySubmit: false,
                clearClose: false,
              }))
            )
          )
        } catch (err) {
          //
        }
      },
    }),
    sendSingleForm: build.query<any, { bookingId: string; formAnswers: any[] }>(
      {
        query: ({ bookingId, formAnswers }) => ({
          url: getUrlWithSearchParams(
            `/v1/bookings/${bookingId}/form-answers`,
            {}
          ),
          method: 'PATCH',
          body: { formAnswers },
        }),
      }
    ),
  }),
})

export const { useGetCustomFormQuery, useLazySendSingleFormQuery } =
  customFormApi
