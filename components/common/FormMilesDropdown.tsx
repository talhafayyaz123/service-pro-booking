import { Controller, RegisterOptions, useFormContext } from 'react-hook-form'

import { IDropdownProps } from '@/components/common/dropdown/Dropdown'

import { MilesDropdown } from './dropdown/MilesDropdown'
interface IFormDropdown extends Omit<IDropdownProps, 'onChange' | 'value'> {
  name: string
  rules?: RegisterOptions
  isMiles?: boolean
}
export const FormMilesDropdown = ({
  name,
  rules,
  isMiles,
  ...rest
}: IFormDropdown) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <MilesDropdown
          {...rest}
          isMiles={isMiles}
          {...field}
          onChange={(v) => field.onChange(v)}
        />
      )}
    />
  )
}
