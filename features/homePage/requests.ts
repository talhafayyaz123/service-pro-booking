import { instance } from '@/store/instance'

export const getTopRated = async (url: string) => {
  return await instance.get(url)
}
