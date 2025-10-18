import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ICompleteProfile } from '@/types/authTypes'

export const updateProfile = async (body: ICompleteProfile) => {
  try {
    const { data } = await instance.patch<ICompleteProfile>(
      API_LINKS.registerUpdate,
      body
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}
