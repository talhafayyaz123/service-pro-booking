import { NoOptions } from '@/components/common/dropdown/NoOptions'
import { Radio } from '@/components/common/Radio'
import { H16 } from '@/components/typography'
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

export const DropdownContent = ({
  options,
  onChange,
  value,
  sideEffect,
  className = '',
  itemClassName = 'my-1 p-1.5 pl-2.5',
  withRadio,
}: Props) => {
  return (
    <div className={`max-h-[320px] my-3  w-full  overflow-auto ${className}`}>
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

            const LabelComponent =
              typeof option.label === 'string' ? H16 : 'div'
            return (
              <div
                className={`text-left ${itemClassName} truncate cursor-pointer transition rounded ${
                  active ? 'bg-orange ' : 'hover:bg-lightGray'
                }`}
                role={'none'}
                onClick={() => {
                  onChange && onChange(option)
                  sideEffect && sideEffect()
                }}
                key={index}
              >
                <LabelComponent
                  className={`truncate inline  ${
                    active ? '!text-white' : '!text-black'
                  }`}
                >
                  {typeof option.label === 'function'
                    ? option.label(option)
                    : option.label}
                </LabelComponent>
                {withRadio && <Radio checked={active} />}
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
