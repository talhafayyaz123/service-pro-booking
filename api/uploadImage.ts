import { UPLOAD_IMG_LINK } from '@/core/consts/apiLinks'
import { instance } from '@/store/instance'

interface Response {
  image: string
}

export const setUploadImage = async ({
  file,
  path,
}: {
  file: File
  path: string
}) => {
  try {
    const { data } = await instance.postForm<Response>(UPLOAD_IMG_LINK, {
      image: file,
      path,
    })

    return data
  } catch (e) {
    return Promise.reject(e)
  }
}
