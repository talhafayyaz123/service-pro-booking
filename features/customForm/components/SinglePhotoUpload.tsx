import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { memo, PropsWithChildren, useCallback, useMemo, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Controller, useFormContext } from 'react-hook-form'

import { IconUploadCloud2 } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H14 } from '@/components/typography'
import { EImageType, MODALS_TYPE } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { ImageCropper } from '@/features/accountSetup/components/image/cropper'
import { readFile } from '@/features/accountSetup/components/image/helpers'
import { useCustomFormStore } from '@/features/customForm/hooks/useCustomFormStore'
import { IConvertableForm, TNameType } from '@/features/customForm/types'
import {
  useDepositRequestedBookingStore,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import { useSignUpStep } from '@/features/signUp/hooks/useSignUpStepper'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

interface Props {
  name: string
  isRequired: boolean
}

export const SinglePhotoUpload = ({ isRequired, name }: Props) => {
  const dispatch = useAppDispatch()
  const session = useSession()
  const authToken = usePaymentLinkStore((state) => state.accessToken)

  const {
    setBookingStepOnPhotoUploading,
    dontChangeBookingStepOnPhotoUploading,
  } = useSignUpStep(
    ({
      setBookingStepOnPhotoUploading,
      dontChangeBookingStepOnPhotoUploading,
    }) => ({
      setBookingStepOnPhotoUploading,
      dontChangeBookingStepOnPhotoUploading,
    })
  )
  const {
    setValue,
    getValues,
    setError: setFormError,
    clearErrors,
  } = useFormContext<IConvertableForm>()

  const isAnswered = getValues('isAnswered')
  const imageLink = getValues(name as TNameType) as string
  const [image, setImage] = useState<{ id: string; link: string }>({
    id: '',
    link: imageLink,
  })
  const [error, setError] = useState<{
    isError: boolean
    codes?: string[]
  }>({
    isError: false,
    codes: undefined,
  })
  const [rawImage, setRawImage] = useState<string>()
  const { photoCropOpen, setPhotoCropOpen } = useCustomFormStore()
  const [photoName, setPhotoName] = useState('')

  const handleClose = useCallback(() => {
    setRawImage(undefined)
    setPhotoCropOpen(false)
    setPhotoName('')
  }, [setPhotoCropOpen])

  const handleImage = useCallback(
    (props: { id: string; link: string }) => {
      // set image for internal state
      setImage(props)

      // set image link for parent form state
      setValue(name as TNameType, props.link)

      // close cropping modal
      setPhotoCropOpen(false)
      setPhotoName('')
    },
    [name, setPhotoCropOpen, setValue]
  )

  const onDrop = async (
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setError({ isError: false, codes: undefined })
      // setFormError(name as TNameType, { message: undefined })
      clearErrors(name as TNameType)

      const imageDataUrl = await readFile(acceptedFiles[0])

      setRawImage(imageDataUrl as string)
      setPhotoCropOpen(true)
      setPhotoName(name)

      // reset this state to initial
      if (dontChangeBookingStepOnPhotoUploading) {
        setBookingStepOnPhotoUploading(false)
      }
    }

    // Has error
    if (rejectedFiles && rejectedFiles.length > 0) {
      const errorTypes = rejectedFiles.flatMap((err) =>
        err.errors.map((errObj) => {
          if (errObj.code === 'file-invalid-type') {
            return 'File type is invalid.'
          }

          if (errObj.code === 'file-too-large') {
            return 'The file size should not exceed 10 MB.'
          }

          return errObj.code
        })
      )

      setFormError(name as TNameType, { message: errorTypes.join(' ') })

      setError({
        isError: true,
        codes: errorTypes,
      })
    }
  }

  const onRemove = () => {
    // remove photo from form state
    setValue(name as TNameType, '')

    setImage({
      id: '',
      link: '',
    })
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
    maxSize: 10 * 1024 * 1024,
    disabled: session.status === 'unauthenticated' && !authToken,
  })

  const [openPreviewImage, setOpenPreviewImage] = useState(false)
  const { bookingType, setIsInfoPhotoUpload } = useDepositRequestedBookingStore(
    ({ bookingType, setIsInfoPhotoUpload }) => ({
      bookingType,
      setIsInfoPhotoUpload,
    })
  )

  const handleOpenSignUp = () => {
    setBookingStepOnPhotoUploading(true)
    if (bookingType === 'simple') {
      dispatch(setModal({ currentModal: MODALS_TYPE.SIGN_UP_TO_CONFIRM }))
    } else {
      setIsInfoPhotoUpload(true)
      dispatch(
        setModal({
          currentModal: MODALS_TYPE.PAYMENT_LINK_INFO_MODAL,
          text: 'Add your info',
        })
      )
    }
  }

  const memoizedImageCropper = useMemo(() => {
    if (rawImage) {
      return (
        <ImageCropper
          cropShape="rect"
          handleImage={handleImage}
          image={rawImage}
          type={EImageType.CUSTOM_FORM_IMAGE}
          onCloseModal={handleClose}
        />
      )
    }

    return null
  }, [handleClose, handleImage, rawImage])

  return (
    <>
      <MemoizedCropModal
        isOpen={photoCropOpen && photoName === name}
        onClose={handleClose}
      >
        {memoizedImageCropper}
      </MemoizedCropModal>
      <Modal
        isOpen={openPreviewImage}
        onClose={() => setOpenPreviewImage(false)}
        space=""
        onCloseButton={true}
        className="h-full w-full bg-black/80 flex flex-col"
        wrapperClassName="p-0"
        hideTransition
        closeButtonClassName="size-8 flex items-center justify-center rounded-full bg-white mt-10 mr-4 [&>svg]:size-3"
      >
        <div className="grow flex items-center px-4">
          <div className="w-full relative h-[376px] rounded-xl overflow-hidden small:mx-auto small:size-[500px] tablet:size-[700px]">
            <Image
              src={image.link}
              alt=""
              className="object-cover"
              layout="fill"
            />
          </div>
        </div>
      </Modal>
      <Controller
        render={({ field, fieldState }) => {
          return (
            <div className="flex flex-col mt-4">
              {!image.link && (
                <div
                  ref={field.ref}
                  className={cn(
                    'relative overflow-hidden min-h-[100px] w-full border border-lightGray rounded-xl flex flex-col items-center justify-center',
                    fieldState.error && 'border-orange'
                  )}
                >
                  <div
                    className={cn(
                      'absolute inset-0 flex flex-col items-center justify-center',
                      isDragActive && 'bg-lightGray transition-colors'
                    )}
                    {...getRootProps()}
                  >
                    {session.status === 'authenticated' || authToken ? (
                      <>
                        <IconUploadCloud2 className="text-gray size-6" />
                        <H14 color="text-gray">Size limit: 10MB</H14>
                        <input
                          className={'focus-visible:none'}
                          {...getInputProps()}
                        />
                      </>
                    ) : (
                      <H14 role="button" onClick={handleOpenSignUp}>
                        <span className="text-orange">Sign in</span> or{' '}
                        <span className="text-orange">Sign up</span> to upload
                        an image
                      </H14>
                    )}
                  </div>
                </div>
              )}
              {image.link && !error.isError && (
                <>
                  <div
                    role="button"
                    onClick={() => setOpenPreviewImage(true)}
                    className="relative h-[376px] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={image.link}
                      alt=""
                      className="object-cover"
                      layout="fill"
                    />
                  </div>
                  {!isAnswered && (
                    <Button
                      onClick={onRemove}
                      buttonType="lightMain"
                      className="mt-4"
                    >
                      Remove photo
                    </Button>
                  )}
                </>
              )}
            </div>
          )
        }}
        rules={{
          required: { value: isRequired, message: 'Photo is required' },
        }}
        name={name}
      />
    </>
  )
}

const MemoizedCropModal = memo<
  PropsWithChildren & { isOpen: boolean; onClose: () => void }
>(({ children, isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      space=""
      onCloseButton={false}
      className="h-full w-full"
      wrapperClassName="p-0"
      hideTransition
    >
      {children}
    </Modal>
  )
})
