import { instance } from '@/store/instance'

export const inspirationRequest = async (url: string) => {
  return await instance.get(url)
}
