import dynamic from 'next/dynamic'
import useTranslation from 'next-translate/useTranslation'
import { Fragment, useEffect, useState } from 'react'
import { get, useFieldArray, useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import uuid from 'react-uuid'

import { IconPlus } from '@/assets/icons/icons'
import { Modal } from '@/components/modals/Modal'
import { ErrorMessage, H12, H18, H40 } from '@/components/typography'
import { EImageType, MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { ImageCropper } from '@/features/accountSetup/components/image/cropper'
import { readFile } from '@/features/accountSetup/components/image/helpers'
import { IViewImageCropperProps } from '@/features/accountSetup/components/image/view-cropper'
import { inputs, steps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import { useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import useMixpanel from '@/hooks/useMixpanel'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'
import { MixpanelEvents } from '@/types/mixpanel'

const ViewImageCropper = dynamic<IViewImageCropperProps>(() =>
  import('features/accountSetup/components/image/view-cropper').then(
    (mod) => mod.ViewImageCropper
  )
)

const AdditionalInfo = () => {
  const { control, formState } = useFormContext<TOnboardingSchema>()

  const { fields, remove, update, append } = useFieldArray({
    control,
    name: inputs[steps.portfolio].photos,
    keyName: 'id',
    rules: {
      maxLength: 10,
      minLength: 2,
    },
  })

  const { isSmall, isTablet } = useMediaScreen()
  const mobile = isSmall || isTablet

  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { trackEvent } = useMixpanel()
  const dispatch = useDispatch()
  const { currentModal } = useAppSelector(modalsSelector)

  const [currentImageId, setCurrentImageId] = useState('')

  const modalopen = currentModal === MODALS_TYPE.UPLOAD_PICTURE
  const viewModalOpen = currentModal === MODALS_TYPE.VIEW_UPLOADED_PICTURE

  const handleOpen = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.UPLOAD_PICTURE }))
  }

  const handleViewPicture = (imageId: string) => {
    setCurrentImageId(imageId)
    dispatch(setModal({ currentModal: MODALS_TYPE.VIEW_UPLOADED_PICTURE }))
  }

  const handleClose = () => {
    dispatch(setModal({}))
  }

  const onFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    itemId: string
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)

      const foundItemIndex = fields.findIndex(
        (item) => item.uniqueId === itemId
      )
      const foundItem = fields[foundItemIndex]

      update(foundItemIndex, {
        ...foundItem,
        original: imageDataUrl as string,
      })

      setCurrentImageId(foundItem.uniqueId as string)
      handleOpen()
    }
  }

  const handleImage = ({ link }: { id: string; link: string }) => {
    const foundItemIndex = fields.findIndex(
      (item) => item.uniqueId === currentImageId
    )
    const foundItem = fields[foundItemIndex]

    update(foundItemIndex, {
      ...foundItem,
      url: link,
    })
    handleClose()
  }

  const onRemove = (index: number) => {
    remove(index)
  }

  const error = get(formState.errors, inputs[steps.portfolio].photos)?.message

  const filledFields = fields.filter((field) => field.url).length

  useEffect(() => {
    if (fields.length === 10) return

    if (fields.length === filledFields) {
      append({
        id: '',
        uniqueId: uuid(),
        url: '',
        original: '',
        isCover: false,
        order: fields.length + 1,
      })
    }
  }, [fields, append, filledFields])

  useEffect(() => {
    trackEvent(MixpanelEvents.pages.onboarding.PORTFOLIO_IMAGES_PAGE)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const currentImageIndex = fields.findIndex(
    (item) => item.uniqueId === currentImageId
  )
  const selectedImage = fields[currentImageIndex]

  return (
    <>
      <Modal
        isOpen={modalopen}
        onClose={handleClose}
        space=""
        onCloseButton={false}
        className="h-full w-full"
        wrapperClassName="p-0"
        hideTransition
      >
        {selectedImage?.original && (
          <ImageCropper
            cropShape="rect"
            handleImage={handleImage}
            image={selectedImage.original}
            type={EImageType.PORTFOLIOS}
          />
        )}
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        maxWidth={mobile ? 800 : 700}
        onClose={handleClose}
        space=""
        onCloseButton={false}
        hideTransition
        className="maxTablet:w-full maxTablet:h-full tablet:rounded-3xl"
        wrapperClassName="p-0 flex items-center justify-center"
      >
        {viewModalOpen && selectedImage?.original && (
          <ViewImageCropper
            cropShape="rect"
            order={currentImageIndex}
            remove={onRemove}
            update={update}
            handleImage={handleImage}
            image={selectedImage.original}
            type={EImageType.PORTFOLIOS}
          />
        )}
      </Modal>

      <div className="my-8 tablet:mt-20 bg-white mx-auto px-5 tablet:p-[60px] max-w-[620px] rounded-[20px] tablet:shadow-xl flex flex-col gap-8">
        <div className="flex flex-col gap-1">
          <H40 className="!font-bold">{t('titles.portfolio_pothos')}</H40>
          <H18 color="text-gray" className="font-sofiaprolight">
            {t('text.portfolio_pothos_text')}
          </H18>
        </div>
        <div className="grid grid-cols-2 w-full gap-6">
          {fields
            .sort((item1) => (item1.isCover ? -1 : 1))
            .map((item) => (
              <Fragment key={item.uniqueId}>
                <input
                  id={'file-' + item.uniqueId}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    onFileChange(e, item.uniqueId as string)
                  }}
                  accept="image/png, image/jpeg, image/webp"
                />
                {item?.url ? (
                  <span key={item.uniqueId} className="relative">
                    {item.isCover && (
                      <H12
                        color="text-black"
                        className="px-2 py-0.5 rounded-full bg-white border border-lightGray absolute top-2 left-2 !leading-4"
                      >
                        Primary
                      </H12>
                    )}
                    <button
                      type="button"
                      onClick={() => handleViewPicture(item.uniqueId as string)}
                    >
                      <img
                        src={item?.url}
                        alt={item?.id}
                        className="aspect-square rounded-xl object-cover"
                      />
                    </button>
                  </span>
                ) : (
                  <label
                    key={item.uniqueId}
                    htmlFor={'file-' + item.uniqueId}
                    className="bg-white border border-lightGray aspect-square flex place-content-center place-items-center relative rounded-xl cursor-pointer"
                  >
                    <IconPlus className="text-gray" />
                  </label>
                )}
              </Fragment>
            ))}
        </div>
        {error && fields.length <= 2 && (
          <ErrorMessage className="-mt-4 tablet:text-14">{error}</ErrorMessage>
        )}
      </div>
    </>
  )
}

export default AdditionalInfo
