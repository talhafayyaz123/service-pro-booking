import { ChangeEvent, memo, useCallback, useMemo, useState } from 'react'
import ReactCountryFlag from 'react-country-flag'
import { useFormContext } from 'react-hook-form'

import { IComboDropdownNew } from '@/components/common/comboDropdown/ComboDropdown'
import { IDropdownProps } from '@/components/common/dropdown/Dropdown'
// import { NewDropdown } from '@/components/common/dropdown/NewDropdown'
import { OnSearch } from '@/components/common/dropdown/OnSearch'
import { IInputProps, Input } from '@/components/common/Input'
import { ErrorMessage, Label } from '@/components/typography'
import { phoneAndCountriesArr, phoneOptions } from '@/core/consts/countries'
import { IOptions } from '@/types/common'

interface IDoubleNameNewProps extends IInputProps {
  dropdownName?: string
  inputName?: string
  sideEffect?: () => void
  isClearedError?: boolean
}

export const FormPhoneDropdown = memo(
  ({ dropdownName, inputName, ...rest }: IDoubleNameNewProps) => {
    const config = usePhoneDropdownConfigNew(
      dropdownName,
      inputName,
      rest.sideEffect,
      rest.isClearedError ?? true
    )

    return (
      <ComboDropdownNew
        {...rest}
        {...config}
        error={rest.error || (config.error as any)}
      />
    )
  }
)

const usePhoneDropdownConfigNew = (
  leftName = 'phoneNumberCode',
  rightName = 'phoneNumber',
  sideEffect?: () => void,
  isClearedError?: boolean
) => {
  const {
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useFormContext()

  const error = errors[leftName]?.message || errors[rightName]?.message
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState(phoneOptions)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)

    setOptions(
      phoneOptions.filter((option) =>
        option.search.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  const onInputsChange = useCallback(
    (key: string, value: string | IOptions) => {
      setValue(key, value)
    },
    [setValue]
  )

  const phoneNumberCode = watch(leftName)
  const phoneNumber = watch(rightName)
  const dropdownProps: IDropdownProps = useMemo(
    () => ({
      value: phoneNumberCode,
      onSearch: <OnSearch value={search} onChange={handleSearch} />,
      maxWidth: 260,
      placeholder: '+123',
      options,
      alternativeRender: (value) => {
        const currentValue = phoneAndCountriesArr.find(
          (el) => el.id === (value as IOptions)?.id
        )
        return (
          <div className="flex items-center">
            {currentValue?.flag}
            <span className={'pl-2.5'}>{currentValue?.dial_code}</span>
          </div>
        )
      },
      onChange: (option) => {
        sideEffect?.()
        onInputsChange(leftName, option)
      },
    }),
    [leftName, onInputsChange, options, phoneNumberCode, search, sideEffect]
  )

  const inputProps: IInputProps = useMemo(
    () => ({
      value: phoneNumber,
      placeholder: 'Phone number',
      type: 'tel',
      onChange: (e) => {
        sideEffect?.()

        if (!isNaN(Number(e.target.value))) {
          onInputsChange(rightName, e.target.value)
        }
        if (error && isClearedError) {
          clearErrors('phoneNumber')
        }
      },
    }),
    [
      phoneNumber,
      sideEffect,
      error,
      isClearedError,
      onInputsChange,
      rightName,
      clearErrors,
    ]
  )
  return { dropdownProps, inputProps, error }
}

export const ComboDropdownNew = ({
  // dropdownProps,
  inputProps,
  label,
  // dropDownWidth = 'w-[124px]',
  labelClassName,
  className,
  error,
  // height,
  reverse,
  center,
  isLoading,
}: IComboDropdownNew) => {
  const elements = useMemo(
    () => [
      // <NewDropdown
      //   key="dropdown"
      //   tippyProps={{ sticky: true }}
      //   className={`${
      //     center ? '' : dropDownWidth
      //   } rounded-none border-none py-3`}
      //   height={height}
      //   {...dropdownProps}
      // />,
      <span key="flag" className="flex-shrink-0 flex h-6 overflow-hidden pl-3">
        <ReactCountryFlag
          style={{
            fontSize: '24px',
          }}
          svg
          countryCode={'US'}
          aria-label={'United States'}
        />
        <span className="px-3">+1</span>
      </span>,
      <div key="line" className="w-px h-[40%] bg-lightGray" />,
      <Input
        isLoading={isLoading}
        key="input"
        focusVisible={{ control: false, work: true }}
        className="flex-shrink-0"
        inputClassName="flex-shrink-0 rounded-none border-white py-3"
        type="number"
        {...inputProps}
      />,
    ],
    [inputProps, isLoading]
  )

  const gridCols = useMemo(
    () => (center ? 'grid-cols-[1fr_1px_1fr]' : 'grid-cols-[auto_1px_1fr]'),
    [center]
  )

  const elementsArray = useMemo(
    () => (reverse ? elements.reverse() : elements),
    [elements, reverse]
  )
  return (
    <div data-testid={'phone-dropdown'} className={`${className}`}>
      {label && (
        <Label className={`flex mb-2 ${labelClassName}`}>{label}</Label>
      )}
      <div
        className={`grid ${gridCols} items-center ${
          error ? 'border-orange' : 'border-lightGray '
        } border rounded-xl overflow-hidden`}
      >
        {elementsArray.map((el) => el)}
      </div>
      {error && (
        <ErrorMessage className="block mt-2 text-left">{error}</ErrorMessage>
      )}
    </div>
  )
}
