import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop/types'
import { useDispatch } from 'react-redux'

import { uploadFile } from '@/api/utils/upload'
import { uploadFileExternalUser } from '@/api/utils/uploadExternalUser'
import { IconChevroLeft } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { ErrorMessage, H16 } from '@/components/typography'
import { EImageType } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { getCroppedImg } from '@/features/accountSetup/components/image/helpers'
import { useDepositRequestedBookingStore } from '@/features/paymentLink/store/store'
import { useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { accountSetupSelector } from '@/store/accountSetup/accountSetupSelectors'
import { setImage } from '@/store/accountSetup/accountSetupSlice'
import { setModal } from '@/store/modals/modalsSlice'

export interface IImageCropperProps {
  cropShape: 'rect' | 'round'
  handleImage: ({ id, link }: { id: string; link: string }) => void
  image: string
  type: EImageType
  onCloseModal?: () => void
}

export const ImageCropper = ({
  cropShape,
  handleImage,
  image,
  type,
  onCloseModal,
}: IImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const dispatch = useDispatch()
  const { image: images } = useAppSelector(accountSetupSelector)

  const { isSmall, isTablet } = useMediaScreen()

  const mobile = isSmall || isTablet

  const mutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: EImageType }) => {
      // check if photo is uploaded in walk in booking
      // use another upload function that uses external user's access token
      const bookingType = useDepositRequestedBookingStore.getState().bookingType

      if (bookingType === 'walkIn') {
        return await uploadFileExternalUser({ file, type })
      }

      // for simple file uploads
      return await uploadFile({ file, type })
    },
    onSuccess: (data) => {
      handleImage(data)
      dispatch(
        setImage({
          image: [
            ...images,
            {
              original: image as string,
              cropped: croppedImage as string,
            },
          ],
        })
      )
      onClose()
    },
    onError: (error: AxiosError) => {
      if (error?.response?.status === 413) {
        setError('File size is too large')
      }
    },
  })

  const onCropComplete = (_: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const showCroppedImage = async () => {
    try {
      setLoading(true)
      const croppedImage = await getCroppedImg(
        image as string,
        croppedAreaPixels as Area
      )
      setCroppedImage(croppedImage?.blob as string)
      setLoading(false)
      mutation.mutate({
        file: croppedImage?.file as File,
        type,
      })
    } catch (e: any) {
      setLoading(false)
      console.error(e, 'error')
      setError(e)
    }
  }

  const onClose = () => {
    if (onCloseModal) {
      onCloseModal()
    } else {
      dispatch(setModal({}))
    }

    setCroppedImage(null)
  }

  return (
    <div className="w-full h-full tablet:p-0 relative flex flex-col gap-5 place-items-center overflow-y-auto">
      <div className="w-full flex tablet:hidden justify-center items-center py-6 px-5 sticky top-0 z-20 bg-white">
        <IconChevroLeft
          onClick={onClose}
          className="absolute left-5 cursor-pointer"
        />
        <H16 className="font-semibold">View photos</H16>
      </div>
      <div
        className={
          'hidden tablet:flex items-center justify-between px-20 bg-white py-5 w-full relative shadow-xl'
        }
      >
        <Button onClick={onClose} buttonType="withIcon" size="44">
          Back
        </Button>
        <H16 className="font-semibold">View photos</H16>

        <Button onClick={onClose} buttonType="white" size="44">
          Delete photo
        </Button>
      </div>
      <H16 color="text-gray" className="tablet:!text-black -mt-4 tablet:mt-8">
        Move and scale to show in the frame
      </H16>
      <div className="w-full px-7 maxSmall:px-0 flex flex-col items-center gap-6">
        <div className="w-full h-[325px] tablet:h-[50dvh] tablet:w-[520px] flex relative">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            showGrid={false}
            cropShape={cropShape}
            aspect={4 / 4}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName:
                'w-[85dvw] h-80 tablet:w-full h-full mx-auto rounded-xl !absolute',
              cropAreaClassName: '!aspect-square',
            }}
          />
        </div>
        <input
          id="range"
          type="range"
          min={1}
          max={50}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className={cn(
            'w-full max-w-[183px] h-2 appearance-none cursor-pointer outline-none rounded-lg'
          )}
          style={{
            background: `linear-gradient(to right, #F36A46 ${
              zoom * 2
            }%, #78788052 ${zoom * 2}%)`,
          }}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </div>

      <div className="w-full tablet:py-4.5 maxTablet:px-5 maxTablet:py-3 maxTablet:rounded-20 shadow-xl bg-white flex justify-end items-center sticky top-full tablet:pr-20">
        <Button
          type="button"
          buttonType="orange"
          size="44"
          disabled={loading || mutation.isPending}
          onClick={showCroppedImage}
          className="w-full tablet:w-max"
        >
          {mobile ? 'Save' : 'Upload'}
        </Button>
      </div>
    </div>
  )
}
