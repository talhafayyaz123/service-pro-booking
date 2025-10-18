import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Area, Point } from 'react-easy-crop/types'
import { useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { uploadFile } from '@/api/utils/upload'
import {
  IconChevroLeft,
  IconClose,
  IconHeart,
  IconTrashPortfolio,
} from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { ErrorMessage, H16, H24 } from '@/components/typography'
import { EImageType } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { IImageCropperProps } from '@/features/accountSetup/components/image/cropper'
import { getCroppedImg } from '@/features/accountSetup/components/image/helpers'
import { inputs, steps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import { useAppSelector } from '@/hooks/hooks'
import { accountSetupSelector } from '@/store/accountSetup/accountSetupSelectors'
import { setImage } from '@/store/accountSetup/accountSetupSlice'
import { setModal } from '@/store/modals/modalsSlice'

type TFieldType = {
  id: string
  url: string
  order: number
  original: string
  isCover: boolean
  uniqueId: string
}

export interface IViewImageCropperProps extends IImageCropperProps {
  order: number
  remove: (index: number) => void
  update: (index: number, data: TFieldType) => void
}

export const ViewImageCropper = ({
  cropShape,
  handleImage,
  image,
  type,
  order,
  remove,
  update,
}: IViewImageCropperProps) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [loading, setLoading] = useState(false)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>()
  const [croppedImage, setCroppedImage] = useState<string | null>(null)
  const [error, setError] = useState<string>('')
  const { watch } = useFormContext<TOnboardingSchema>()
  const fields = watch(inputs[steps.portfolio].photos)

  const dispatch = useDispatch()
  const { image: images } = useAppSelector(accountSetupSelector)

  const mutation = useMutation({
    mutationFn: async ({ file, type }: { file: File; type: EImageType }) => {
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

  const handleRemove = () => {
    remove(order)
    dispatch(setModal({}))
  }

  const handleMakePrimary = () => {
    update(0, {
      id: fields?.[order].id as string,
      url: fields?.[order].url as string,
      original: fields?.[order].original as string,
      order: 0,
      isCover: true,
      uniqueId: fields?.[order].uniqueId as string,
    })
    update(order, {
      id: fields?.[0].id as string,
      url: fields?.[0].url as string,
      original: fields?.[0].original as string,
      order,
      isCover: false,
      uniqueId: fields?.[0].uniqueId as string,
    })
    dispatch(setModal({}))
  }

  const onClose = () => {
    dispatch(setModal({}))
    setCroppedImage(null)
  }

  return (
    <div className="tablet:p-0 relative h-full w-full flex flex-col gap-5 place-items-center overflow-y-auto">
      <div className="w-full flex tablet:hidden justify-center items-center py-6 px-5 sticky top-0 z-20 bg-white">
        <IconChevroLeft
          onClick={onClose}
          className="absolute left-5 cursor-pointer"
        />
        <H16 className="font-semibold">View photos</H16>
      </div>
      <div className="w-full hidden tablet:flex place-content-center pt-8 pb-6 pr-9">
        <H24>View photo</H24>
        <button type="button" onClick={onClose} className="absolute right-14">
          <IconClose width={20} className="text-gray" />
        </button>
      </div>
      <div className="w-full px-8 maxSmall:px-0 flex flex-col items-center gap-6">
        <div className="w-full h-[325px] tablet:h-[50dvh] flex relative">
          <Cropper
            key={image}
            image={image}
            crop={crop}
            zoom={zoom}
            showGrid={false}
            cropShape={cropShape}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            classes={{
              containerClassName:
                'w-[85dvw] tablet:w-full h-full mx-auto rounded-xl !absolute',
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

      <div className="w-full tablet:py-6 tablet:px-8 px-5 py-3 rounded-t-20 tablet:rounded-b-20 shadow-xl bg-white sticky top-full grid grid-cols-1 tablet:grid-cols-3 gap-2">
        <Button
          type="button"
          buttonType="default"
          onClick={handleRemove}
          textClassName="w-full flex place-content-center place-items-center font-sofiaprolight gap-2"
        >
          <IconTrashPortfolio />
          Remove photo
        </Button>
        <Button
          type="button"
          buttonType="default"
          onClick={handleMakePrimary}
          textClassName="w-full flex place-content-center place-items-center font-sofiaprolight gap-2"
        >
          <IconHeart />
          <span className="text-black">Make primary</span>
        </Button>
        <Button
          type="button"
          buttonType="orange"
          disabled={loading || mutation.isPending}
          onClick={showCroppedImage}
          className="w-full"
        >
          Save
        </Button>
      </div>
    </div>
  )
}
