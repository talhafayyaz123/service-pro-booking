import moment from 'moment'
import useTranslation from 'next-translate/useTranslation'
import { useFormContext } from 'react-hook-form'

import { FormDatePicker } from '@/components/common/FormDatePicker'
import { H24, H32 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const Birthday = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { watch } = useFormContext()
  const { t: common } = useTranslation(TRANSLATE_KEYS.common)
  const birthday = watch('birthday')

  return (
    <div className="flex flex-col flex-1 h-full py-5 overflow-auto">
      <div className="flex">
        <div className="bg-white rounded-[20px] flex flex-col mx-auto mt-8 tablet:mt-20 tablet:shadow-xl z-[1] px-5 tablet:p-[60px]">
          <H32 className="!text-28 tablet:!text-[40px] !font-bold leading-[48px]">
            {t('text.birth_date')}
          </H32>
          <H24
            color="text-gray"
            className="!text-[18px] tablet:!text-24 !font-normal max-w-[350px] mt-3 tablet:mt-4 mb-6"
          >
            {t('text.18yo')}
          </H24>
          <FormDatePicker
            placeholder="DD/MM/YY"
            label={common('labels.birthday')}
            name="birthday"
            error={
              moment().diff(birthday, 'year', false) < 18
                ? ' User must be older than 18 y.o.'
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}
