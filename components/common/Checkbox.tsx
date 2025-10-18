import classNames from 'classnames'
import { LegacyRef, memo, ReactNode, useMemo } from 'react'

import { IconCheckbox } from '@/assets/icons/icons'
import { H14, H18 } from '@/components/typography'

interface ICheckbox {
  onChange?: (value: string | undefined) => void
  value?: string | undefined
  checked?: boolean
  rightLabel?: ReactNode
  className?: string
  currentRef?: LegacyRef<HTMLDivElement>
  error?: boolean
  disabled?: boolean
  omitRole?: boolean
}

export const Checkbox = ({
  onChange,
  className,
  value,
  rightLabel,
  checked,
  currentRef,
  error,
  disabled,
  omitRole = false,
  ...rest
}: ICheckbox) => {
  return (
    <div
      role={!omitRole ? 'none' : undefined} // Conditionally set role to 'none'
      tabIndex={omitRole ? 0 : undefined}
      onClick={() => {
        onChange && !disabled && onChange(checked ? undefined : value || '')
      }}
      className={`select-none flex gap-2.5 items-center cursor-pointer ${className}`}
      {...rest}
    >
      <div
        ref={currentRef}
        className={classNames(
          `bg-white border-lightGray select-none items-center h-5 w-5 shrink-0 
           border-2 hover:shadow-xl rounded flex justify-center transition duration-150`,
          {
            ['!bg-orange border-orange hover:!bg-orange1 hover:border-orange1']:
              checked && !disabled,
          },
          { ['border-red-500']: error && !disabled },
          { ['!bg-lightGray !border-lightGray']: disabled }
        )}
      >
        <IconCheckbox className={'text-black'} />
      </div>
      {typeof rightLabel === 'string' ? (
        <H14 className={'!text-black mb-[-2px]'}>{rightLabel}</H14>
      ) : (
        <>{rightLabel}</>
      )}
    </div>
  )
}

export interface ICheckboxWithLabelProps extends ICheckbox {
  label?: ReactNode
  wrapperClassName?: string
  isLoading?: boolean
  omitRole?: boolean
}

export const CheckboxWithLabel = memo(
  ({
    onChange,
    isLoading,
    omitRole = false,
    ...props
  }: ICheckboxWithLabelProps) => {
    const checked = useMemo(() => props.checked, [props.checked])
    return (
      <div
        role={!omitRole ? 'none' : undefined} // Conditionally set role to 'none'
        tabIndex={omitRole ? 0 : undefined} // Allow focus only when omitRole is true
        onClick={() => {
          onChange && !isLoading && onChange(props.value || '')
        }}
        className={`cursor-pointer select-none flex gap-3  ${
          props.wrapperClassName
        } ${isLoading ? 'opacity-50' : ''}`}
      >
        {typeof props.label === 'string' ? (
          <H18>{props.label}</H18>
        ) : (
          props.label
        )}

        <div className={'relative'}>
          <Checkbox {...props} checked={checked} />
          <div
            className={
              'absolute w-full top-0 h-full flex items-center justify-center'
            }
          >
            {/*{isLoading && <div className={'loader_spinner_mini  '} />}*/}
          </div>
        </div>
      </div>
    )
  }
)
