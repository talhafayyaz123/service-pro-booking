import classNames from 'classnames'
import { useMemo } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useFormContext, useWatch } from 'react-hook-form'

// import { useDebouncedCallback } from 'use-debounce'
// import { NewDropdown } from '@/components/common/dropdown/NewDropdown'
// import { OnSearch } from '@/components/common/dropdown/OnSearch'
import { Input } from '@/components/common/Input'
import { ErrorMessage, Label } from '@/components/typography'
// import {
//   phoneAndCountriesObj,
//   phoneOptions,
//   phoneOptionsObj,
// } from '@/core/consts/countries'

interface IFormProps {
  phoneNumberName?: string
  codeName?: string
  label?: string
  sideEffect?: (code?: string, phone?: string) => void
  isLoading?: boolean
}
export const FormPhoneDropdownV2 = ({
  phoneNumberName = 'phoneNumber',
  codeName = 'code',
  sideEffect,
  ...rest
}: IFormProps) => {
  const watch: any = useWatch()
  const phoneNumber = watch?.[phoneNumberName] ?? ''
  const code = watch?.[codeName] ?? ''

  const { setValue, formState } = useFormContext()
  const error = (formState?.errors?.[codeName]?.message ||
    formState?.errors?.[phoneNumberName]?.message) as string

  const _onChange = async (key: string, value?: string) => {
    const _codeV = key === codeName ? value : code
    const _phoneV = key === phoneNumberName ? value : phoneNumber
    setValue(key, value)
    await sideEffect?.(_codeV, _phoneV)
  }

  const _value = useMemo(() => ({ phoneNumber, code }), [code, phoneNumber])

  return (
    <PhoneDropdownV2
      error={error}
      onChangeCode={(v) => _onChange(codeName, v)}
      onChangePhone={(v) => _onChange(phoneNumberName, v)}
      value={_value}
      {...rest}
    />
  )
}

export const PhoneDropdownV2 = ({
  value,
  error,
  onChangePhone,
  // onChangeCode,
  isLoading,
  label,
}: {
  value: { phoneNumber: string; code: string }
  onChangeCode: (value?: string) => void
  onChangePhone: (value?: string) => void
  error?: string
} & IFormProps) => {
  // const [search, setSearch] = useState('')
  // const [options, setOptions] = useState(phoneOptions)

  // const handleSearch = useDebouncedCallback((searchTerm: string) => {
  //   setOptions(
  //     phoneOptions.filter(
  //       (option) =>
  //         option.search.toLowerCase().includes(searchTerm) ||
  //         option.value.toLowerCase().includes(searchTerm)
  //     )
  //   )
  // }, 300)

  // const _onChange = useCallback(
  //   (e: ChangeEvent<HTMLInputElement>) => {
  //     const searchTerm = e.target.value.toLowerCase()
  //     setSearch(searchTerm)
  //     handleSearch(searchTerm)
  //   },
  //   [handleSearch]
  // )

  return (
    <div>
      <Label className={`flex mb-2`}>{label}</Label>
      <article
        className={classNames(
          'grid grid-cols-[auto_1px_1fr] border rounded-xl overflow-hidden border-lightGray items-center',
          { ['border-orange']: !!error }
        )}
      >
        {/* <NewDropdown
          className={'rounded-none border-none py-3 '}
          onChange={(value) => onChangeCode(value.id)}
          options={options}
          value={phoneOptionsObj?.[value.code]}
          tippyProps={{ sticky: true }}
          onSearch={<OnSearch value={search} onChange={_onChange} />}
          maxWidth={260}
          placeholder="+123"
          alternativeRender={(value) => {
            const currentValue = phoneAndCountriesObj?.[value?.id ?? '']
            return (
              <div className="flex items-center">
                {currentValue?.flag}
                <span className={'pl-2.5'}>{currentValue?.dial_code}</span>
              </div>
            )
          }}
        /> */}
        <span
          key="flag"
          className="flex-shrink-0 flex h-6 overflow-hidden pl-3"
        >
          <ReactCountryFlag
            style={{
              fontSize: '24px',
            }}
            svg
            countryCode={'US'}
            aria-label={'United States'}
          />
          <span className="px-3">+1</span>
        </span>
        <div
          key="line"
          className={classNames('w-px h-[40%] bg-lightGray', {
            ['bg-orange']: !!error,
          })}
        />
        <Input
          value={value.phoneNumber}
          className="flex-shrink-0"
          type="number"
          isLoading={isLoading}
          onChange={(e) => onChangePhone(e.target.value)}
          inputClassName="flex-shrink-0 rounded-none border-white py-3"
          focusVisible={{ control: false, work: true }}
        />
      </article>
      {error && (
        <ErrorMessage className="block mt-2 text-left">{error}</ErrorMessage>
      )}
    </div>
  )
}
