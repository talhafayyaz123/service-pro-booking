import useTranslation from 'next-translate/useTranslation'
import { useDropzone } from 'react-dropzone'
import { useDispatch } from 'react-redux'

import { IconCamera, IconClient } from '@/assets/icons/icons'
import { Modal } from '@/components/modals/Modal'
import { ErrorMessage, H16, H20 } from '@/components/typography'
import { EImageType, MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { ImageCropper } from '@/features/accountSetup/components/image/cropper'
import { Card } from '@/features/accountSetup/steps/CardWrapper'
import { useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

interface Value {
  iconUrl?: string
  localeImage?: string
  file?: File | null
}

interface IProps {
  value: Value
  onChange: (v: Value) => void
  error?: string
}

export const UploadImage = ({ value, onChange, error }: IProps) => {
  const handleOpen = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.UPLOAD_PICTURE }))
  }
  const translate = useTranslation(TRANSLATE_KEYS.account_setup)
  const tt = translate.t

  const onDrop = async (files: File[]) => {
    const file = files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      const previewUrl = reader.result as string

      onChange({ localeImage: previewUrl, file: file, iconUrl: '' })
    }
    reader.readAsDataURL(file)
    handleOpen()
  }

  const { getInputProps, open } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  const preview = value?.localeImage || value?.iconUrl
  const dispatch = useDispatch()
  const { currentModal } = useAppSelector(modalsSelector)

  const modalopen = currentModal === MODALS_TYPE.UPLOAD_PICTURE

  return (
    <Card>
      <div className="flex flex-col gap-1">
        <H20>{tt('titles.add_photo')}</H20>
        <H16 color="text-gray">{tt('text.add_photo_text')}</H16>
      </div>
      <label
        role="none"
        onClick={open}
        htmlFor="file"
        className="bg-lightMain w-20 h-20 flex place-content-center place-items-center relative rounded-full"
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={'profile'}
              className="w-20 h-20 flex place-content-center place-items-center relative rounded-full object-cover"
            />
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onChange({ localeImage: '', iconUrl: '', file: null })
              }}
              className={
                'absolute z-[1] right-0 bottom-0  shadow-xl bg-orange w-5 h-5 rounded-10 flex items-center justify-center'
              }
            >
              <H16 color={'text-white'}>-</H16>
            </button>
          </>
        ) : (
          <>
            <IconClient width={30} />
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex place-content-center place-items-center">
              <IconCamera />
            </span>
          </>
        )}
      </label>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <input className="focus-visible:none" {...getInputProps()} />

      <Modal
        isOpen={modalopen}
        onClose={() => {
          dispatch(setModal({}))
        }}
        space=""
        hideTransition
        onCloseButton={false}
        className="h-full w-full"
        wrapperClassName="p-0"
      >
        <ImageCropper
          cropShape="round"
          handleImage={({ link }) =>
            onChange({ localeImage: '', iconUrl: link, file: null })
          }
          image={preview ?? ''}
          type={EImageType.AVATAR}
        />
      </Modal>
    </Card>
  )
}
