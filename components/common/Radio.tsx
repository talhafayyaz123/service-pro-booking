import { LegacyRef, ReactNode, useRef } from 'react'

import { H18 } from '@/components/typography'
export interface IRadioProps {
  checked: boolean
  onChange?: (value: string) => void
  className?: string
  value?: string
  rightLabel?: boolean
  currentRef?: LegacyRef<HTMLDivElement>
  error?: boolean
}
export const Radio = ({
  checked,
  className,
  value,
  onChange,
  currentRef,
  error,
}: IRadioProps) => {
  return (
    <div
      role={'radio'}
      ref={currentRef}
      aria-checked={checked}
      onClick={() => onChange && value && onChange(value)}
      className={`-mt-px relative w-[22px] h-[22px] shrink-0 rounded-full overflow-hidden hover:shadow-base cursor-pointer flex  ${
        checked
          ? 'bg-orange border border-orange'
          : `border bg-white  ${error ? 'border-red-500' : ' border-lightGray'}`
      } ${className}`}
    >
      <div
        className={
          'absolute top-1/2 left-1/2  transform -translate-x-1/2 -translate-y-1/2'
        }
      >
        <div
          className={`${checked ? 'show' : ''} bg-white rounded-full h-3 w-3`}
        />
      </div>
    </div>
  )
}
export interface IRadioWithLabelProps extends IRadioProps {
  wrapperClassName?: string
  label: ReactNode
}
export const RadioWithLabel = (props: IRadioWithLabelProps) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const content = [
    typeof props.label === 'string' ? (
      <H18 key={'1111'}>{props.label}</H18>
    ) : (
      props.label
    ),
    <Radio key={'2222'} {...props} currentRef={ref} />,
  ]
  return (
    <div
      role={'radio'}
      aria-checked={props.checked}
      onClick={() => ref.current?.click()}
      className={`cursor-pointer select-none flex gap-3 items-center  ${props.wrapperClassName}`}
    >
      {props.rightLabel ? content.reverse() : content}
    </div>
  )
}
