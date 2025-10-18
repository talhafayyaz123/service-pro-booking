import { UPLOAD_FILE_LINK } from '@/core/consts/apiLinks'
import { EImageType } from '@/core/consts/common'
import { usePaymentLinkStore } from '@/features/paymentLink/store/store'
import { serverSideInstance } from '@/store/instance'

interface Response {
  id: string
  link: string
}

export const uploadFileExternalUser = async ({
  file,
  type,
}: {
  file: File
  type: EImageType
}) => {
  const token = usePaymentLinkStore.getState().accessToken
  const instance = serverSideInstance({ token })
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
