import React from 'react'

import { FormTextArea } from '@/components/common/FormTextArea'

export const Answer = ({
  maxLength,
  name,
  isRequired,
}: {
  maxLength: 150 | 500
  name: string
  isRequired: boolean
}) => {
  return (
    <FormTextArea
      name={name}
      rules={{
        required: { value: isRequired, message: ' ' },
      }}
      className={'mt-2 tablet:mt-3'}
      placeholder={'Enter your answer'}
      count
      minRows={3}
      maxLength={maxLength}
    />
  )
}
