import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useDispatch } from 'react-redux'

import { getstepBasic } from '@/api/onboarding-pro/get-basic-info'
import { IconCamera, IconClient } from '@/assets/icons/icons'
import { CheckboxWithLabel } from '@/components/common/Checkbox'
import { FormInput } from '@/components/common/FormInput'
import { FormTextArea } from '@/components/common/FormTextArea'
import { Modal } from '@/components/modals/Modal'
import { ErrorMessage, H16, H18, H20, H32 } from '@/components/typography'
import { EImageType, MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { ImageCropper } from '@/features/accountSetup/components/image/cropper'
import { readFile } from '@/features/accountSetup/components/image/helpers'
import { inputs, steps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import { Card } from '@/features/accountSetup/steps/CardWrapper'
import { useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

export const BasicInfo = () => {
  const [imgUrl, setImgUrl] = useState<string>('')
  const [image, setImage] = useState<{ id: string; link: string }>({
    id: '',
    link: '',
  })

  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { watch, setValue, formState } = useFormContext<TOnboardingSchema>()
  const { usename, businessName, iconUrl } = watch(steps.basicInfo)
  const { data: session } = useSession()
  const { firstName, lastName } = useAppSelector(
    (state) => state.me.meReference
  )

  const meName = `${firstName} ${lastName}`

  const dispatch = useDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const modalopen = currentModal === MODALS_TYPE.UPLOAD_PICTURE

  const { data } = useQuery({
    queryKey: ['onboarding', 'pro', 'basic-info', session?.user?.accessToken],
    queryFn: getstepBasic,
  })

  const handleOpen = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.UPLOAD_PICTURE }))
  }

  const handleClose = () => {
    dispatch(setModal({}))
  }

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)
      setImgUrl(imageDataUrl as string)
      handleOpen()
    }
  }

  const handleImage = ({ id, link }: { id: string; link: string }) => {
    setValue(inputs[steps.basicInfo].iconUrl, link)
    setImage({ id, link })
  }

  useEffect(() => {
    if (usename) {
      setValue(inputs[steps.basicInfo].businessName, meName || '')
    }
    //eslint-disable-next-line
  }, [usename, meName])

  useEffect(() => {
    if (businessName !== meName) {
      setValue(inputs[steps.basicInfo].usename, false)
    }
    //eslint-disable-next-line
  }, [businessName, meName])

  useEffect(() => {
    if (data) {
      setValue(steps.basicInfo, { ...data, usename: false })
      setImage({ id: data.id, link: data.iconUrl })
    }
    //eslint-disable-next-line
  }, [data])

  return (
    <>
      <div className="flex flex-col items-center flex-1 h-full tablet:py-10 small:py-5 overflow-auto">
        <div className="max-w-[620px] w-full rounded-20 tablet:p-15 small:px-5 flex flex-col gap-6 py-6 bg-white shadow-xl">
          <div className="flex flex-col gap-1 maxTablet:px-5">
            <H32 className="!font-bold">{t('titles.introduce')}</H32>
            <H18 color="text-gray">{t('text.intro_text')}</H18>
          </div>
          <Card>
            <div className="flex flex-col gap-1">
              <H20>{t('titles.add_photo')}</H20>
              <H16 color="text-gray">{t('text.add_photo_text')}</H16>
            </div>

            <input
              type="file"
              id="file"
              name="file"
              className="hidden"
              onChange={onFileChange}
              accept="image/png, image/jpeg, image/webp"
            />
            <label
              htmlFor="file"
              className="bg-lightMain w-20 h-20 flex place-content-center place-items-center relative rounded-full"
            >
              {image.link ? (
                <img
                  src={image.link}
                  alt={image.id}
                  className="w-20 h-20 flex place-content-center place-items-center relative rounded-full object-cover"
                />
              ) : (
                <>
                  <IconClient width={30} />
                  <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white flex place-content-center place-items-center">
                    <IconCamera />
                  </span>
                </>
              )}
            </label>
            {!iconUrl && formState.isSubmitted && (
              <ErrorMessage className={'block text-left -mt-4'}>
                {t('errors.photo_error')}
              </ErrorMessage>
            )}
          </Card>
          <Card>
            <div className="flex flex-col gap-4">
              <H20 className="mt-1">{t('titles.business_name')}</H20>
              <FormInput
                name={inputs[steps.basicInfo].businessName}
                placeholder={t('placeholders.business_name')}
              />

              <Controller
                name={inputs[steps.basicInfo].usename}
                render={({ field }) => (
                  <CheckboxWithLabel
                    onChange={() => field.onChange(!field.value)}
                    value={field.value}
                    checked={field.value}
                    wrapperClassName="flex justify-between"
                    label={<H16>{t('text.use_name')}</H16>}
                  />
                )}
              />
            </div>
          </Card>
          <Card>
            <div className="flex flex-col gap-4">
              <H20 className="mt-1">{t('titles.about_me')}</H20>
              <H16 color="text-gray">{t('text.about_text')}</H16>

              <FormTextArea
                name={inputs[steps.basicInfo].bio}
                placeholder={t('text.about_placeholder')}
                inputClassName="min-h-52"
              />
            </div>
          </Card>
        </div>
      </div>
      <Modal
        isOpen={modalopen}
        onClose={handleClose}
        space=""
        hideTransition
        onCloseButton={false}
        className="h-full w-full"
        wrapperClassName="p-0"
      >
        <ImageCropper
          cropShape="round"
          handleImage={handleImage}
          image={imgUrl}
          type={EImageType.AVATAR}
        />
      </Modal>
    </>
  )
}
