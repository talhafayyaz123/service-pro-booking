import { ReactNode } from 'react'

import { H16 } from '@/components/typography'

export const NoOptions = ({
  value,
  text,
}: {
  value?: ReactNode
  text?: string
}) => {
  return (
    <div className={'flex items-center justify-center'}>
      {value ?? <H16 className={''}>{text ?? 'No options'}</H16>}
    </div>
  )
}
