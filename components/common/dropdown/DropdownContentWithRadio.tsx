import { NoOptions } from '@/components/common/dropdown/NoOptions'
import { Radio } from '@/components/common/Radio'
import { IOptions } from '@/types/common'

interface Props {
  options: IOptions[]
  onChange: (option: IOptions) => void
  value: string | IOptions
  sideEffect?: () => void
  className?: string
  itemClassName?: string
  withRadio?: boolean
}

export const DropdownContentWithRadio = ({
  options,
  onChange,
  value,
  sideEffect,
  className = '',
  itemClassName = ' p-4 pl-2.5',
}: Props) => {
  return (
    <div className={`max-h-[320px]  w-full overflow-auto ${className}`}>
      {options?.length ? (
        <div className={''}>
          {options.map((option, index) => {
            const active = option?.id
              ? (value as IOptions)?.id === option?.id
              : typeof value === 'string'
              ? value === option.value
              : value?.key
              ? value?.key === option.key
              : value?.value === option.value
            return (
              <div
                className={`text-left border-b border-lightGray hover:bg-lightGray flex items-center ${itemClassName} truncate cursor-pointer transition ${
                  active ? 'bg-white ' : ''
                }`}
                role={'none'}
                onClick={() => {
                  onChange && onChange(option)
                  sideEffect && sideEffect()
                }}
                key={index}
              >
                <div
                  className={`truncate inline  ${
                    active ? '!text-orange' : '!text-black'
                  }`}
                >
                  {typeof option.label === 'function'
                    ? option.label(option)
                    : option.label}
                </div>
                <Radio className={'ml-auto'} checked={active} />
              </div>
            )
          })}
        </div>
      ) : (
        <NoOptions />
      )}
    </div>
  )
}
