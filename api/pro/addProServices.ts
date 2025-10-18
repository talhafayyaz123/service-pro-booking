import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ICategoryService } from '@/types/categoriesTypes'

export const addProServices = async (categories: ICategoryService[]) => {
  try {
    // Mutation: correct every category and service order
    categories.forEach((cat, index) => {
      if (!cat.order) {
        cat.order = index
      }

      if (cat.categories && cat.categories.length > 0) {
        cat.categories.forEach((service, index) => {
          service.order = index
        })
      }
    })

    const { data } = await instance.post(API_LINKS.addProServices, {
      categories,
    })

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}
