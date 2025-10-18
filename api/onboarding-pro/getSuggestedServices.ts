import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { instance } from '@/store/instance'

interface Response {
  total: number
  data: [
    {
      id: string
      name: string
      price: number
      description: string
      duration: number
      isFeatured: boolean
      numberOfUsage: number
      businessType: {
        id: string
        iconUrl: string
        name: string
        color: string
        proCount: number
      }
    }
  ]
}

export const getSuggestedServices = async (categoryId: string) => {
  try {
    const { data } = await instance.get<Response>(
      getUrlWithSearchParams(API_ONBOARDING.serviceSuggestions, {
        businessTypeId: categoryId,
      })
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}
