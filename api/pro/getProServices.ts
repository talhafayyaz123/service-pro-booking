import { API_ONBOARDING } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ICategoryService } from '@/types/categoriesTypes'

interface Response {
  categoriesBlock: ICategoryService[]
}

export const getProServices = async () => {
  try {
    const { data } = await instance.get<Response>(API_ONBOARDING.proServices)

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}
