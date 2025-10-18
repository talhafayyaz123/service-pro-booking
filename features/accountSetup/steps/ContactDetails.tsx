import useTranslation from 'next-translate/useTranslation'
import { useFormContext } from 'react-hook-form'

import { IconOrangeTick } from '@/assets/icons/icons'
import { CheckboxWithLabel } from '@/components/common/Checkbox'
import { FormPhoneDropdown } from '@/components/common/dropdown/phoneDropdown/FormPhoneDropdown'
import { FormInput } from '@/components/common/FormInput'
import { H16, H40, OrangeBlock } from '@/components/typography'
import { defaultPhoneCode } from '@/core/consts/countries'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { useAppSelector } from '@/hooks/hooks'
import { IOnboardingFormState } from '@/types/onboarding'

export const ContactDetails = () => {
  const { onboarding } = useAppSelector((state) => state.accountSetup)

  const { t } = useTranslation(TRANSLATE_KEYS.account_setup)
  const {
    setValue,
    getValues,
    formState: { errors },
    clearErrors,
  } = useFormContext<IOnboardingFormState>()
  const phoneError = errors.proContacts?.phone?.message

  const { emailCheckbox, phoneCheckbox } =
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    getValues('proContacts')
  const handleChangeEmail = () => {
    if (emailCheckbox && !onboarding?.proContacts?.email) {
      setValue('proContacts.email', '')
    }

    setValue('proContacts.emailCheckbox', !emailCheckbox)
  }

  const handleChangePhone = () => {
    if (phoneCheckbox && !onboarding?.proContacts?.phone) {
      setValue('proContacts.phone', '')
      setValue('proContacts.phoneCode', defaultPhoneCode)
    }
    setValue('proContacts.phoneCheckbox', !phoneCheckbox)
  }

  return (
    <div className="mt-8 tablet:mt-20 bg-white mx-auto tablet:p-[60px] max-w-[620px] rounded-[20px] tablet:shadow-xl">
      <OrangeBlock>
        The phone number and email address you enter will be displayed on your
        booking page.
      </OrangeBlock>
      <H40 className="!font-bold mr-10 px-5 tablet:px-0 mt-3">
        {t('titles.contact_details')}
      </H40>
      <div className="shadow-xl px-6 rounded-[20px] mt-8">
        <div className="grid grid-cols-1 gap-px bg-lightGray">
          <div className="bg-white pb-[21px] pt-[25px]">
            <div className="flex items-center justify-between">
              <H16>{t('text.in_app_chat')}</H16>
              <IconOrangeTick />
            </div>
          </div>
          <div className="bg-white py-[21px]">
            <CheckboxWithLabel
              wrapperClassName={'justify-between items-center'}
              checked={phoneCheckbox}
              onChange={handleChangePhone}
              label={<H16>{t('text.phone_number')}</H16>}
            />

            <div
              className={`flex transition-all duration-300 overflow-hidden ${
                phoneCheckbox ? 'h-auto mt-3 ' : 'h-[0px] opacity-0'
              }`}
            >
              {phoneCheckbox && (
                <FormPhoneDropdown
                  className="w-full"
                  dropdownName="proContacts.phoneCode"
                  inputName="proContacts.phone"
                  sideEffect={() => clearErrors('proContacts.phone')}
                  error={phoneError}
                />
              )}
            </div>
          </div>
          <div className="bg-white pt-[21px] pb-[25px]">
            <CheckboxWithLabel
              wrapperClassName="justify-between items-center"
              checked={emailCheckbox}
              onChange={handleChangeEmail}
              label={<H16>{t('text.email')}</H16>}
            />
            <div
              className={`flex transition-all duration-300 overflow-hidden ${
                emailCheckbox ? 'h-auto mt-3' : 'h-[0px] opacity-0'
              }`}
            >
              {emailCheckbox && (
                <FormInput
                  placeholder="Enter email"
                  type="email"
                  className="w-full"
                  name="proContacts.email"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
