import {
  IDatePickerProps,
  useDatePickConfig,
} from '@/components/common/datePicker/DatePicker'

export const DefaultDatePicker = ({ ...props }: IDatePickerProps) => {
  const { content } = useDatePickConfig({
    ...props,
  })

  return content
}
