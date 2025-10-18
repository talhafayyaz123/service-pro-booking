import { useRouter } from 'next/router'
import useTranslation from 'next-translate/useTranslation'
import { memo, useCallback, useEffect } from 'react'

import { IconArrowLeft } from '@/assets/icons/icons'
import { CategoryCard } from '@/components/common/CategoryCard'
import { Modal } from '@/components/modals/Modal'
import { H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'
import { useSearchStore } from '@/features/search/hooks/useSearchStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { modalsSelector } from '@/store/modals/modalsSelectors'
import { setModal } from '@/store/modals/modalsSlice'

const MainPageAllCategoriesModal = memo(() => {
  const { currentModal } = useAppSelector(modalsSelector)
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  const dispatch = useAppDispatch()
  const categories = useAppSelector((state) => state.accountSetup.categories)
  const onClose = useCallback(() => {
    dispatch(setModal({}))
  }, [dispatch])

  const canFetch = useSearchStore((state) => state.canFetch)

  const router = useRouter()

  useEffect(() => {
    return onClose
  }, [onClose])

  const onCategoryClick = (c: string) => {
    canFetch.current = false
    const query = getQueriesForSearchRedirect()
    router.push({
      pathname: ROUTES.search,
      query: { ...query, query: c },
    })
  }

  return (
    <Modal
      onClose={onClose}
      wrapperClassName="max-w-[503px] w-full flex items-center justify-center mx-auto "
      titleClassName="px-10 pb-7"
      title={<H24>{t('titles.all_categories')}</H24>}
      space="pt-8 pb-3"
      isOpen={currentModal === MODALS_TYPE.MAIN_PAGE_ALL_CATEGORIES}
    >
      <div className="max-w-[503px] min-w-0 w-full max-h-[469px] overflow-y-scroll pl-[18px] pr-2">
        <div>
          {categories.map((category) => (
            <CategoryCard
              className={`!py-1.5`}
              key={category.id}
              size="60"
              data={category}
              onClick={() => {
                onCategoryClick(category.name)
                onClose()
              }}
            >
              <IconArrowLeft className={'rotate-180 stroke-black'} />
            </CategoryCard>
          ))}
        </div>
      </div>
    </Modal>
  )
})
export default MainPageAllCategoriesModal
