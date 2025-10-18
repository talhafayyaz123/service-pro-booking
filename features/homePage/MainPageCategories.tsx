import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { ImgPlus } from '@/assets/images/images'
import { CategoryIcon } from '@/components/common/CategoryCard'
import { H16 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { useAppDispatch } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { mainCategoriesSelector } from '@/store/accountSetup/accountSetupSelectors'
import { setModal } from '@/store/modals/modalsSlice'

import { getQueriesForSearchRedirect } from '../search/helpers/localLocation'
import { useSearchStore } from '../search/hooks/useSearchStore'

const MainPageCategories = () => {
  const { categories } = useSelector(mainCategoriesSelector)

  const { isSmall, isDesktop, isTablet, isLaptop } = useMediaScreen()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const handleOpenModal = () => {
    dispatch(setModal({ currentModal: MODALS_TYPE.MAIN_PAGE_ALL_CATEGORIES }))
  }
  const canFetch = useSearchStore((state) => state.canFetch)

  const media = useMemo(() => {
    if (isSmall) {
      return 6
    } else if (isTablet) {
      return 6
    } else if (isDesktop) {
      return 8
    } else if (isLaptop) {
      return 6
    } else {
      return 6
    }
  }, [isDesktop, isLaptop, isSmall, isTablet])

  const size = useMemo(
    () => (isSmall || isTablet || isLaptop ? '60' : '80'),
    [isLaptop, isSmall, isTablet]
  )

  const onCategoryClick = (c: string) => {
    canFetch.current = false
    const query = getQueriesForSearchRedirect()
    router.push({
      pathname: ROUTES.search,
      query: { ...query, query: c },
    })
  }

  const currentCategories = categories.filter((_, index) => index <= media)

  return (
    <div className="relative">
      <div className="relative container grid grid-cols-4 laptop:grid-cols-5 desktop:grid-cols-8 px-[18px] tablet:px-[60px] py-8 maxTablet:gap-x-6 gap-y-6 items-center justify-between z-[1] mx-auto text-black bg-white shadow-xl h-full rounded-3xl">
        {currentCategories.map(({ ref: _, ...category }) => (
          <div
            role="button"
            onClick={() => onCategoryClick(category.name)}
            className="flex flex-col items-center mb-auto cursor-pointer"
            key={category.id}
          >
            <CategoryIcon size={size} {...category} />
            <H16 className="text-center mt-2 tablet:mt-2.5">
              {category.name}
            </H16>
          </div>
        ))}
        {categories.length >= media && (
          <div
            role="button"
            onClick={handleOpenModal}
            className="flex flex-col items-center mb-auto cursor-pointer"
          >
            <CategoryIcon size={size} iconUrl={ImgPlus.src} color="#EEF2F5" />
            <H16 className="text-center mt-2 tablet:mt-2.5">More</H16>
          </div>
        )}
      </div>
      <div className="absolute bg-violet h-[50%] z-[0] w-full top-0" />
    </div>
  )
}

export default MainPageCategories
