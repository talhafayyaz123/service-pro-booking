import { ChangeEvent, useState } from 'react'
import { Controller } from 'react-hook-form'

import {
  IDropdownProps,
  NewDropdown,
} from '@/components/common/dropdown/NewDropdown'
import { OnSearch } from '@/components/common/dropdown/OnSearch'
import { countryOptions } from '@/core/consts/countries'

interface IProps extends Partial<IDropdownProps> {
  name?: string
}

export const FormCountryDropdown = ({ name = 'country', ...rest }: IProps) => {
  const [search, setSearch] = useState('')
  const [options, setOptions] = useState(countryOptions)

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setOptions(
      countryOptions.filter((option) =>
        option.search.toLowerCase().includes(e.target.value.toLowerCase())
      )
    )
  }

  return (
    <Controller
      name={name}
      render={({ field }) => (
        <NewDropdown
          onSearch={<OnSearch value={search} onChange={handleSearch} />}
          value={field.value}
          options={options}
          onChange={field.onChange}
          {...rest}
        />
      )}
    />
  )
}
