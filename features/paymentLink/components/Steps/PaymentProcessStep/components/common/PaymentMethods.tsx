import classNames from 'classnames'
import { Fragment, ReactNode } from 'react'

import { Radio } from '@/components/common/Radio'
import { H16 } from '@/components/typography'

interface IProps {
  options: { icon: ReactNode; value: string; label: ReactNode }[]
  value: string | null
  onChange: (v: string | null) => void
  withReset?: boolean
}

export const PaymentMethods = (props: IProps) => {
  const { options } = props
  return (
    <article className={'grid gap-3'}>
      {options.map((method) => (
        <Fragment key={method.value}>
          <MobileItem {...props} method={method} />
          <DesktopItem {...props} method={method} />
        </Fragment>
      ))}
    </article>
  )
}

const DesktopItem = ({
  onChange,
  withReset,
  value,
  method,
}: IProps & {
  method: { icon: ReactNode; value: string; label: ReactNode }
}) => {
  return (
    <button
      className={classNames(
        'maxLaptop:hidden grid grid-cols-[24px_1fr_auto] h-14',
        'text-start items-center gap-3 border border-lightGray rounded-xl px-5',
        { ['border-orange']: value === method.value }
      )}
      onClick={() => {
        if (withReset && value === method.value) {
          onChange(null)
        } else {
          onChange(method.value)
        }
      }}
    >
      <span>{method.icon}</span>
      <H16>{method.label}</H16>
      <Radio checked={value === method.value} />
    </button>
  )
}

const MobileItem = ({
  onChange,
  withReset,
  value,
  method,
}: IProps & {
  method: { icon: ReactNode; value: string; label: ReactNode }
}) => {
  return (
    <button
      className={classNames(
        'laptop:hidden flex h-[56px] gap-3 items-center justify-center  border border-lightGray text-black bg-white rounded-lg',
        { ['border-orange']: value === method.value }
      )}
      onClick={() => {
        if (withReset && value === method.value) {
          onChange(null)
        } else {
          onChange(method.value)
        }
      }}
      key={method.value}
    >
      {method.icon}
      <span>{method.label}</span>
    </button>
  )
}
