import { createAsyncThunk } from '@reduxjs/toolkit'

import { API_INSPIRATION, API_PROFILE } from '@/core/consts/apiLinks'
import { getServerSideUrl } from '@/core/helpers/getUrlWithSearchParams'
import {
  IProfileAbout,
  IProfileReview,
  IProfileServices,
  IProInfo,
  IRating,
  ISimilarPro,
  ITermsOfPayment,
} from '@/features/profile/profileType'
import { instance, serverSideInstance } from '@/store/instance'
import { IResponseData } from '@/types/common'

interface IProps {
  token?: string
  id: string
  headersParams?: Record<string, string>
}

export const getProfilePro = async ({ token, id, headersParams }: IProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
      headersParams,
    }).get<IProInfo>(getServerSideUrl(API_PROFILE.getProById(id)))
    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getRatingPro = async ({ token, id }: IProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
    }).get<IRating>(getServerSideUrl(API_PROFILE.getRatingProById(id)))
    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

interface ReviewsProps extends IProps {
  page: number
  limit: number
}

interface ReviewsResponse {
  reviews: IProfileReview[]
  total: number
}

export const getReviewsPro = async ({
  token,
  id,
  headersParams,
  limit,
  page,
}: ReviewsProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
      headersParams,
    }).get<ReviewsResponse>(
      getServerSideUrl(API_PROFILE.getReviewsProById(id)),
      {
        params: { page, limit },
      }
    )
    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getAboutPro = async ({ token, id, headersParams }: IProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
      headersParams,
    }).get<IProfileAbout>(getServerSideUrl(API_PROFILE.getAboutPro(id)))

    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getTermsOfPaymentPro = async ({ token, id }: IProps) => {
  try {
    const { data } = await serverSideInstance({
      token,
    }).get<ITermsOfPayment>(
      getServerSideUrl(API_PROFILE.getTermsOfPaymentById(id))
    )
    return data
  } catch (e) {
    return Promise.reject(e)
  }
}

export const getProfileProByIdThunk = createAsyncThunk(
  'getProfileProById',
  async (id: string) => {
    try {
      return await instance.get<IProInfo>(
        getServerSideUrl(API_PROFILE.getProById(id))
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
)

export const getProfileProServicesThunk = createAsyncThunk(
  'getProfileProServicesThunk',
  async (id: string) => {
    const { data } = await instance.get<IProfileServices>(
      getServerSideUrl(API_PROFILE.getProServicesById(id))
    )
    return data
  }
)
export const getProfileAboutProThunk = createAsyncThunk(
  'getProfileAboutProThunk',
  async (id: string) => {
    return instance.get<IProfileAbout>(
      getServerSideUrl(API_PROFILE.getAboutPro(id))
    )
  }
)
export const getSimilarProByIdThunk = createAsyncThunk(
  'getSimilarProByIdThunk',
  async (id: string) => {
    const { data } = await instance.get<IResponseData<ISimilarPro>>(
      getServerSideUrl(API_PROFILE.getSimilarPro(id))
    )

    return data
  }
)

export const getRatingProByIdThunk = createAsyncThunk(
  'getRatingProByIdThunk',
  async (id: string) => {
    return instance.get<IRating>(
      getServerSideUrl(API_PROFILE.getRatingProById(id))
    )
  }
)

export const getReviewsProByIdThunk = createAsyncThunk(
  'getReviewsProByIdThunk',
  async ({ id, limit, page }: ReviewsProps) => {
    return await instance.get<ReviewsResponse>(
      getServerSideUrl(API_PROFILE.getReviewsProById(id)),
      {
        params: { limit, page },
      }
    )
  }
)

export const getInspirationsProByIdThunk = createAsyncThunk(
  'getInspirationsProByIdThunk',
  async (id: string) => {
    const { data } = await instance.get<{ reviews: IProfileReview[] }>(
      getServerSideUrl(API_INSPIRATION.byId(id))
    )

    return data
  }
)
export const getTermsOfPaymentByIdThunk = createAsyncThunk(
  'getTermsOfPaymentByIdThunk',
  async (id: string) => {
    const { data } = await instance.get<ITermsOfPayment>(
      getServerSideUrl(API_PROFILE.getTermsOfPaymentById(id))
    )
    return data
  }
)
