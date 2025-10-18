import { useState } from 'react'
import { useDropzone } from 'react-dropzone'

import { setUploadImage } from '@/api/uploadImage'
import { IconCloseSmallBlack, IconPlus } from '@/assets/icons/icons'
import { Spinner } from '@/components/Loaders'

export const DownloadPhoto = ({
  uploadPath,
  sideEffect,
  disabled,
  className,
  showPlusIcon,
  error,
}: {
  uploadPath: string
  sideEffect?: (url: string) => void
  disabled?: boolean
  className?: string
  showPlusIcon?: boolean
  error?: string
}) => {
  const [loading, setLoading] = useState(false)
  const [, setError] = useState(false)

  const onDrop = async (acceptedFiles: File[]) => {
    setLoading(true)
    setError(false)

    try {
      const a = await setUploadImage({
        file: acceptedFiles[0],
        path: uploadPath,
      })
      a && sideEffect && sideEffect(a.image)
      setLoading(false)
    } catch (e) {
      setError(true)
      return setLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    multiple: false,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
    },
  })

  return (
    <>
      <div
        className={`h-[100px] relative bg-[length:auto_100px] bg-center bg-no-repeat cursor-pointer flex items-center
       justify-center flex-1 flex-shrink-0 min-w-[100px] max-w-[100px] border
       rounded-xl overflow-hidden ${
         error ? 'border-red-500' : ' border-lightGray'
       } ${className}`}
      >
        <>
          {loading && (
            <div
              className={
                'h-[100px] animate-pulse bg-lightGray cursor-pointer flex items-center justify-center flex-1 flex-shrink-0 min-w-[100px] max-w-[100px] border border-lightGray rounded-xl'
              }
            />
          )}
          <div
            className={`w-full h-full absolute  outline-0 ${
              disabled
                ? 'cursor-not-allowed bg-lightGray'
                : 'hover:bg-lightGray'
            } ${isDragActive ? 'bg-lightGray' : ''} transition `}
            {...getRootProps({
              onClick:
                disabled || loading ? (e) => e.stopPropagation() : undefined,
            })}
          >
            <input
              className={' focus-visible:none'}
              {...getInputProps({ disabled: loading })}
            />
          </div>
          {showPlusIcon && (
            <IconPlus className={'text-gray  z-10 pointer-events-none'} />
          )}
        </>
      </div>
      {loading && <PhotoSkeleton />}
    </>
  )
}

export const UploadedPhoto = ({
  imageLink,

  length,
  onDelete,
  onClick,
  nonRemovableOne,
}: {
  imageLink: string
  onDelete: () => void
  onClick?: (imgLink: string) => void
  nonRemovableOne?: boolean
  length?: number
}) => {
  return (
    <>
      <div
        role="none"
        style={{
          backgroundImage: `url(${imageLink})`,
        }}
        onClick={() => onClick && onClick(imageLink)}
        className={
          'h-[100px] relative bg-[length:auto_100px] bg-center bg-no-repeat cursor-pointer flex items-center justify-center flex-1 flex-shrink-0 min-w-[100px] max-w-[100px] border border-lightGray rounded-xl overflow-hidden'
        }
      >
        {length === 1 && nonRemovableOne ? (
          <></>
        ) : (
          <div
            role={'button'}
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className={
              'bg-white hover:bg-lightGray hover:shadow-sm transition p-1 absolute top-2 right-2 rounded'
            }
          >
            <IconCloseSmallBlack className={'fill-orange'} />
          </div>
        )}
      </div>
    </>
  )
}

const PhotoSkeleton = () => {
  return (
    <div
      className={
        'h-[100px] relative bg-[length:auto_100px] bg-center bg-no-repeat flex items-center justify-center flex-1 flex-shrink-0 min-w-[100px] max-w-[100px] border border-lightGray rounded-xl overflow-hidden'
      }
    >
      <Spinner />
    </div>
  )
}
