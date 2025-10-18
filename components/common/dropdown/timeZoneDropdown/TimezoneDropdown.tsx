import { ChangeEvent, useState } from 'react'

import {
  IDropdownProps,
  NewDropdown,
} from '@/components/common/dropdown/NewDropdown'
import { OnSearch } from '@/components/common/dropdown/OnSearch'
import timezones from '@/core/consts/timezones.json'

export const TimezoneDropdown = ({
  ...rest
}: Omit<IDropdownProps, 'options'>) => {
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState(timezones)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setOptions(
      timezones.filter((option) =>
        option.label.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  return (
    <NewDropdown
      onSearch={<OnSearch value={search} onChange={handleSearch} />}
      {...rest}
      options={options}
    />
  )
}
