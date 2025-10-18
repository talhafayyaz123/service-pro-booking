import { Controller } from 'react-hook-form'

import {
  DatePicker,
  IDatePickerProps,
} from '@/components/common/datePicker/DatePicker'

export const FormDatePicker = ({
  name,
  ...rest
}: Omit<IDatePickerProps, 'value' | 'onChange'> & { name: string }) => {
  return (
    <Controller
      name={name}
      render={({ field }) => (
        <DatePicker
          type="text"
          mode={'default'}
          value={field.value}
          onChange={field.onChange}
          {...rest}
        />
      )}
    />
  )
}
