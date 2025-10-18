import { UPLOAD_FILE_LINK } from '@/core/consts/apiLinks'
import { EImageType } from '@/core/consts/common'
import { instance } from '@/store/instance'

interface Response {
  id: string
  link: string
}

export const uploadFile = async ({
  file,
  type,
}: {
  file: File
  type: EImageType
}) => {
  try {
    const { data } = await instance.postForm<Response>(UPLOAD_FILE_LINK, {
      image: file,
      imageType: type,
    })

    return data
  } catch (e) {
    return Promise.reject(e)
  }
}
