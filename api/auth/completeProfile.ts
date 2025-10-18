import { API_LINKS } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'
import { ICompleteProfile } from '@/types/authTypes'

export const completeProfileFn = async (body: ICompleteProfile) => {
  try {
    const { data } = await instance.put<ICompleteProfile>(
      API_LINKS.completeProfile,
      body
    )

    return data
  } catch (err) {
    return Promise.reject(err)
  }
}
