import useTranslation from 'next-translate/useTranslation'
import { ChangeEvent, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'

import { getProTax } from '@/api/pro/getProTax'
import { Checkbox } from '@/components/common/Checkbox'
import { FormInput } from '@/components/common/FormInput'
import { FormTextArea } from '@/components/common/FormTextArea'
import { H14, H16, H20, H40, OrangeBlock } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export const TermsOfPayment = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const { setValue, watch } = useFormContext()

  useEffect(() => {
    const _getTax = async () => {
      const { taxPercent } = await getProTax()
      setValue('termsOfPayments.tax', taxPercent || 0)
    }
    _getTax()
  }, [setValue])

  const onTermsChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    if (textState?.length > text.length) {
      setValue('termsOfPayments.description', text)
      return
    }

    const newText = text
      .split('\n')
      .map((textLine) =>
        textLine[0] === '\u2022' ? textLine : '\u2022 ' + textLine
      )
      .join('\n')

    setValue('termsOfPayments.description', newText)
  }

  const textState = watch('termsOfPayments.description')
  const tax = watch('termsOfPayments.tax')
  return (
    <div className="my-8 tablet:mt-20 bg-white mx-auto  tablet:p-[60px] max-w-[620px] rounded-[20px] tablet:shadow-xl">
      <H40 className="!font-bold mr-10 maxTablet:px-5 px-6 tablet:px-0">
        {t('titles.terms_of_payment')}
      </H40>
      <div className="bg-white mt-5 tablet:mt-6 p-5 tablet:pt-6 tablet:p-6 rounded-[20px] shadow-xl">
        <div className="flex justify-between">
          <H16>{t('labels.pay_in_cash')}</H16>
          <Checkbox className="opacity-30" checked />
        </div>
        <OrangeBlock className="mt-3 tablet:mx-0">
          <H16>{t('text.pay_in_app_description')}</H16>
        </OrangeBlock>
        <div className="pt-5 mt-5 border-t border-lightGray">
          <div className="flex justify-between opacity-30">
            <H16>{t('labels.pay_in_online')}</H16>
            <Checkbox className={'!cursor-no-drop'} checked={false} />
          </div>
        </div>
      </div>
      <div className="bg-white mt-5 tablet:mt-6 p-5 tablet:pt-6 tablet:p-6 rounded-[20px] shadow-xl">
        <FormInput
          leftLabel={<span className="text-gray">%</span>}
          inputClassName="pl-9"
          error={tax > 100 ? 'Tax cannot be more than 100%' : ''}
          name="termsOfPayments.tax"
          label="Add tax"
          type="number"
          onKeyPress={(event) => {
            if (!/[0-9]/.test(event.key)) {
              event.preventDefault()
            }
          }}
        />
      </div>
      <div className="bg-white mt-3 tablet:mt-5 p-5 tablet:p-6 rounded-[20px] shadow-xl">
        <div className="pb-5 mb-5 border-b border-lightGray">
          <div className="flex justify-between opacity-30">
            <H16>{t('labels.apply_deposit')}</H16>
            <Checkbox className={'!cursor-no-drop'} checked={false} />
          </div>
        </div>
        <H14 className="block !leading-[18px] opacity-40">
          {t('labels.apply_deposit_description')}
        </H14>
      </div>
      <div className="bg-white mt-4.5 tablet:mt-5 pt-6 p-5 tablet:p-6 rounded-[20px] shadow-xl">
        <H20 className="mb-5">{t('titles.other_policies')}</H20>
        <FormTextArea
          label={t('labels.other_policies_label')}
          minRows={5}
          inputClassName="p-4 pb-[35px] overflow-auto text-wrap"
          count
          onChange={onTermsChange}
          name="termsOfPayments.description"
          maxLength={500}
        />
      </div>
    </div>
  )
}
