import useTranslation from 'next-translate/useTranslation'
import { createRef, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useSelector } from 'react-redux'

import { CategoryCard } from '@/components/common/CategoryCard'
import { FormCheckbox } from '@/components/common/FormCheckbox'
import { FormRadio } from '@/components/common/FormRadio'
import { H40 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppDispatch } from '@/hooks/hooks'
import { getMainOfServicesThunk } from '@/store/accountSetup/accountSetupRequests'
import { mainCategoriesSelector } from '@/store/accountSetup/accountSetupSelectors'
import { TCategory } from '@/types/common'

interface IChooseCategory {
  type: TCategory
}

export const ChooseCategory = ({ type }: IChooseCategory) => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { watch } = useFormContext()
  const dispatch = useAppDispatch()
  const { categories } = useSelector(mainCategoriesSelector)
  useEffect(() => {
    dispatch(getMainOfServicesThunk())
  }, [dispatch])

  const currentCategories = useMemo(
    () =>
      type === 'main'
        ? categories.map((e) => ({ ...e, ref: createRef<HTMLDivElement>() }))
        : categories
            .filter((category) => category.id !== watch('mainCategoryId'))
            .map((e) => ({ ...e, ref: createRef<HTMLDivElement>() })),
    [categories, type, watch]
  )

  const title: Record<TCategory, string> = useMemo(
    () => ({
      main: t('titles.main_category'),
      additional: t('titles.additional_categories'),
    }),
    [t]
  )

  return (
    <div className="maxTablet:max-w-[425px] max-w-[620px] bg-white mx-auto  pt-8 px-5 tablet:p-[60px] tablet:my-20 rounded-[20px] tablet:shadow-xl">
      <H40 className="!font-bold mb-0.5 maxTablet:mb-4">{title[type]}</H40>
      <div className="grid grid-cols-1 tablet:gap-px bg-lightGray">
        {currentCategories.map((data) => (
          <CategoryCard
            className={'cursor-pointer'}
            onClick={() => {
              data.ref?.current?.click()
            }}
            data={data}
            key={data.id}
          >
            {type === 'main' ? (
              <FormRadio
                currentRef={data.ref}
                name={'mainCategoryId'}
                value={data.id}
              />
            ) : (
              <FormCheckbox
                currentRef={data.ref}
                name={`categories.${data.id}`}
              />
            )}
          </CategoryCard>
        ))}
      </div>
    </div>
  )
}
