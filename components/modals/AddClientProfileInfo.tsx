import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { useCallback } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { addUserCategories } from '@/api/user/addUserCategories'
import { Button } from '@/components/common/buttons/Button'
import { CategoryCard } from '@/components/common/CategoryCard'
import { FormCheckbox } from '@/components/common/FormCheckbox'
import { Modal } from '@/components/modals/Modal'
import { H18, H24, H28 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { mainCategoriesSelector } from '@/store/accountSetup/accountSetupSelectors'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

const AddClientProfileInfo = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const dispatch = useAppDispatch()
  const { currentModal } = useAppSelector(modalsSelector)
  const methods = useForm()
  const { handleSubmit } = methods
  const { categories } = useSelector(mainCategoriesSelector)
  const { data } = useSession()

  const onSubmit = handleSubmit(async ({ categories }) => {
    const c: string[] = []

    Object.keys(categories).forEach((k) => {
      if (categories[k]) {
        c.push(k)
      }
    })

    await addUserCategories(c, data?.user.accessToken as string)
    onClose()
  })
  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  const disabled = Object.values({ ...methods.watch('categories') }).some(
    (e) => e
  )
  return (
    <Modal
      onClose={onClose}
      maxWidth={503}
      space={' pt-8 '}
      noHeader
      isOpen={currentModal === MODALS_TYPE.CLIENT_ADD_PROFILE_INFO}
    >
      <div>
        <div className={'flex items-center justify-between px-10'}>
          <div className={'w-[35px]'} />
          <H24>{t('text.add_profile_info')}</H24>
          <H18
            onClick={onClose}
            color={'text-gray'}
            className={'cursor-pointer'}
          >
            {t('buttons.skip')}
          </H18>
        </div>
        <div
          className={
            ' w-full flex flex-col border-t pt-6 mt-6 border-lightGray'
          }
        >
          <H28 className={' px-10 text-left'}>
            {t('text.choose_categories')}
          </H28>
          <FormProvider {...methods}>
            <form onSubmit={onSubmit}>
              <div className={'max-h-[400px] mt-3 px-10 h-full overflow-auto'}>
                <div
                  className={'grid grid-cols-1 text-left gap-px bg-lightGray '}
                >
                  {categories.map((data, index) => (
                    <CategoryCard
                      className={` cursor-pointer ${
                        index === 0 ? 'tablet:!pt-3' : undefined
                      }`}
                      data={data}
                      onClick={() => {
                        data.ref?.current?.click()
                      }}
                      key={data.id}
                    >
                      <FormCheckbox
                        currentRef={data.ref}
                        name={`categories.${data.id}`}
                      />
                    </CategoryCard>
                  ))}
                </div>
              </div>
              <div className={'px-10 mb-5 pt-5 border-t border-lightGray'}>
                <Button
                  disabled={!disabled}
                  type={'submit'}
                  className={'w-full'}
                  buttonType={'3d'}
                >
                  {t('buttons.save_and_continue')}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </Modal>
  )
}

export default AddClientProfileInfo
