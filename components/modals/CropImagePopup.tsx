import 'react-image-crop/dist/ReactCrop.css'

import { useRef, useState } from 'react'
import ReactCrop, { PixelCrop } from 'react-image-crop'

import { H16, H24 } from '@/components/typography'
import { imgPreview } from '@/core/helpers/imageCrop'

import { Button } from '../common/buttons/Button'
import { Modal } from './Modal'

interface Props {
  isOpen: boolean
  onClose: () => void
  image: string
  onSave: (src: string) => void
  onRemove: () => void
}

const CropImagePopup: React.FC<Props> = ({
  isOpen,
  onClose,
  image,
  onRemove,
  onSave,
}) => {
  const [crop, setCrop] = useState<PixelCrop | undefined>()
  const imgRef = useRef<HTMLImageElement>(null)

  const onCropComplete = async () => {
    if (imgRef.current && crop) {
      const imgSrc = await imgPreview(imgRef.current, crop)
      onSave(imgSrc)
      setCrop(undefined)
      onClose()
    }
  }

  return (
    <Modal
      onClose={() => {
        onClose()
        setCrop(undefined)
        // reset(defaultValues)
      }}
      maxWidth={700}
      space="small:pt-8 pt-[52px]"
      // isOpen={true}
      divider
      titleClassName="small:px-8 px-6 small:pb-6 mx-auto"
      fromBottom
      className="small:rounded-3xl small:mx-6 small:my-10 rounded-t-[20px] max-h-screen"
      wrapperClassName="flex small:items-center items-end justify-center small:p-1"
      title={<H24 className="font-bold">View photo</H24>}
      isOpen={isOpen}
    >
      <div className="small:min-h-[600px] min-h-[500px] flex flex-col justify-between">
        <H16 className="px-6 mt-6 mx-auto">
          Move and scale to show in the frame
        </H16>
        <div className="p-6 flex flex-1">
          <div className="flex items-center justify-center flex-1">
            <ReactCrop
              minHeight={100}
              minWidth={100}
              crop={crop}
              onChange={(c) => setCrop(c)}
            >
              <img
                ref={imgRef}
                src={image}
                crossOrigin="anonymous"
                alt="view"
                className="w-full h-full small:!max-h-[500px] !max-h-[400px]"
              />
            </ReactCrop>
          </div>
        </div>
        <div
          className="small:pt-6 flex justify-center items-center small:px-8 px-5 small:pb-8 py-3 rounded-t-[20px] small:rounded-t-none small:rounded-b-[20px] small:!shadow-xl relative z-20"
          style={{
            boxShadow: '0px -4px 27px rgb(182 190 206 / 30%)',
          }}
        >
          <Button
            onClick={onCropComplete}
            type="submit"
            className="w-full outline-none"
            buttonType="orange"
          >
            Save
          </Button>
          <Button
            className="w-full ml-5"
            type="button"
            buttonType="lightMain"
            onClick={() => {
              onRemove()
              onClose()
            }}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CropImagePopup
