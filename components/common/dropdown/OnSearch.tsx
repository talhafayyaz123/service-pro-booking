import { IInputProps, Input } from '@/components/common/Input'

export const OnSearch = ({ value, onChange }: IInputProps) => {
  return (
    <Input
      className="mt-3"
      autoFocus
      size="25"
      placeholder="Search"
      value={value}
      onChange={onChange}
      type="text"
    />
  )
}
