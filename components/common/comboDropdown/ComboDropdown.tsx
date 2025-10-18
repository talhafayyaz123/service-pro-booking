import { useMemo } from 'react'

import { Dropdown, IDropdownProps } from '@/components/common/dropdown/Dropdown'
import { IInputProps, Input } from '@/components/common/Input'
import { ErrorMessage, Label } from '@/components/typography'

interface IComboDropdown extends IInputProps {
  left: IDropdownProps
  right: IInputProps
  error?: string
  dropDownWidth?: string
  center?: boolean
  reverse?: boolean
}

export interface IComboDropdownNew extends IInputProps {
  dropdownProps: IDropdownProps
  inputProps: IInputProps
  error?: string
  dropDownWidth?: string
  center?: boolean
  reverse?: boolean
}

export const ComboDropdown = ({
  left,
  right,
  label,
  dropDownWidth = 'w-[124px]',
  labelClassName,
  className,
  error,
  reverse,
  center,
}: IComboDropdown) => {
  const elements = useMemo(
    () => [
      <Dropdown
        key="dropdown"
        inputClassName={`${
          center ? '' : dropDownWidth
        } rounded-none border-none py-3`}
        {...left}
      />,
      <div key="line" className={'w-px h-[40%] bg-lightGray'} />,
      <Input
        key="input"
        focusVisible={{ control: false, work: true }}
        className="flex-shrink-0"
        inputClassName="flex-shrink-0 rounded-none border-white py-3"
        type="number"
        {...right}
      />,
    ],
    [center, dropDownWidth, left, right]
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
    <div className={`${className}`}>
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
