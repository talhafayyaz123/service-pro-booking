import classNames from 'classnames'
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
  useState,
} from 'react'
import MaskedInput, { Mask, PipeConfig } from 'react-text-mask'

import {
  IconChevronDropdown,
  IconCloseEye,
  IconCloseSmallBlack,
  IconLoader,
  IconOpenEye,
  IconSearch,
} from '@/assets/icons/icons'
import { ErrorMessage, Label } from '@/components/typography'
import { cn } from '@/core/helpers/cn'
import { IOptions, TSize } from '@/types/common'

export interface IInputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'size' | 'value' | 'onClick'
  > {
  size?: TSize
  label?: ReactNode
  value?: string | IOptions | number
  focusVisible?: { control: boolean; work: boolean }
  error?: string | boolean
  labelClassName?: string
  mask?: Mask | ((value: string) => Mask)
  guide?: boolean
  alternativeRender?: (value?: IOptions | string) => ReactNode
  placeholderChar?: string
  keepCharPositions?: boolean
  inputClassName?: string
  leftLabel?: ReactNode
  arrow?: boolean
  searchPosition?: 'left' | 'right'
  pipe?: (
    conformedValue: string,
    config: PipeConfig
  ) => false | string | { value: string; indexesOfPipedChars: number[] }
  showMask?: boolean
  onDelete?: () => void
  search?: boolean
  onClick?: () => void
  noBorder?: boolean
  isLoading?: boolean
}

export const Input = ({
  className,
  size = '50',
  type = 'text',
  arrow = false,
  alternativeRender,
  error,
  inputClassName = '',
  guide,
  label,
  labelClassName = '',
  placeholderChar,
  keepCharPositions,
  pipe,
  showMask,
  search = false,
  focusVisible,
  onDelete,
  searchPosition,
  noBorder,
  leftLabel,
  isLoading,
  value,
  mask,
  placeholder,
  ...rest
}: IInputProps) => {
  const [currentType, setCurrentType] = useState(type)
  const classes = `bg-white text-16 font-normal leading-[22px] border border-lightGray ${
    alternativeRender ? 'text-white' : 'text-black'
  }  outline-0  rounded-xl block w-full transition duration-150 ${
    !noBorder
      ? focusVisible?.work
        ? focusVisible.control
          ? 'border-black'
          : ''
        : 'focus-visible:border-black'
      : ''
  }`
  const inputConfig = useInputConfig(arrow, onDelete, search, searchPosition)
  return (
    <div className={className}>
      {label && (
        <Label
          className={`flex small:mb-2 mb-2.5 ${labelClassName} overflow-hidden`}
        >
          {label}
        </Label>
      )}
      <div className="relative">
        {mask ? (
          <MaskedInput
            {...(rest as any)}
            guide={guide}
            keepCharPositions={keepCharPositions}
            placeholderChar={placeholderChar}
            showMask={showMask}
            pipe={pipe}
            // type={currentType}
            autoComplete="new-password"
            className={`${classes} ${
              inputConfig[size]
            } !focus:outline-0 !outline-none ${
              error ? '!border-orange' : ''
            }  ${inputClassName}`}
          />
        ) : (
          <div className={'relative'} style={{ position: 'relative' }}>
            <input
              {...rest}
              placeholder={alternativeRender ? '' : placeholder}
              value={alternativeRender ? '' : (value as string)}
              className={classNames(
                `truncate !focus:outline-0 !outline-none`,
                classes,
                inputConfig[size],
                { ['!border-orange']: error },
                inputClassName,
                { ['pr-10']: type === 'password' }
              )}
              type={currentType}
            />
            {search && (
              <IconSearch
                className={`absolute ${
                  searchPosition === 'left' ? 'left-[17.5px]' : 'right-[17.5px]'
                } top-1/2 -translate-y-1/2`}
              />
            )}
            {leftLabel && (
              <div className={'absolute -translate-y-1/2 top-1/2 left-4'}>
                {leftLabel}
              </div>
            )}
            {arrow && (
              <IconChevronDropdown
                className={`absolute  ${
                  focusVisible?.control ? 'rotate-[180deg]' : ''
                } top-1/2 maxTablet:right-3 right-5 cursor-pointer transition  transform  -translate-y-1/2 bg-white `}
              />
            )}
            {onDelete && (
              <div
                role={'button'}
                onClick={onDelete}
                className={
                  'p-2 -translate-y-1/2 hover:bg-lightGray  absolute top-1/2 rounded-full right-3 transition flex items-center flex-1 justify-center'
                }
              >
                <IconCloseSmallBlack
                  className={`scale-150 flex-shrink-0  cursor-pointer transition`}
                />
              </div>
            )}
            {alternativeRender && (
              <div className="absolute transform -translate-y-1/2 bg-white cursor-pointer top-1/2 left-5">
                {alternativeRender(value as IOptions)}
              </div>
            )}

            {type === 'password' && (
              <PasswordIcon
                setCurrentType={() =>
                  setCurrentType((prev) =>
                    prev !== 'password' ? 'password' : 'text'
                  )
                }
                currentType={currentType}
              />
            )}
            {isLoading && (
              <div className={'absolute -translate-y-1/2 top-1/2 right-4'}>
                <IconLoader className={cn('animate-spin')} />
              </div>
            )}
          </div>
        )}
        {error && typeof error === 'string' && error?.length > 0 ? (
          <ErrorMessage className={'block text-left mt-1'}>
            {error}
          </ErrorMessage>
        ) : undefined}
      </div>
    </div>
  )
}

const useInputConfig = (
  arrow: boolean,
  onDelete?: () => void,
  search?: boolean,
  searchPosition?: 'left' | 'right'
) => {
  const rightSpace = arrow ? 'pr-[30px]' : onDelete ? 'pr-8' : ''
  const searchSpace = search
    ? searchPosition === 'left'
      ? 'pl-[46px]'
      : searchPosition === 'right'
      ? 'pr-[46px]'
      : 'pl-[46px]'
    : ''
  return useMemo(
    () => ({
      '25': `py-2 px-5 ${rightSpace}  ${searchSpace}`,
      '50': `px-5 py-[13px] ${rightSpace}  ${searchSpace}`,
      '46': '',
      '36': '',
      '44': '',
      '40': '',
      '42': `h-[42px] px-5 ${rightSpace}  ${searchSpace}`,
      '100': `${rightSpace}`,
      '200': `px-5 py-3.5 ${rightSpace} ${searchSpace}`,
      '300': '',
    }),
    [rightSpace, searchSpace]
  )
}

const PasswordIcon = ({
  setCurrentType,
  currentType,
}: {
  setCurrentType: () => void
  currentType: IInputProps['type']
}) => {
  return (
    <div
      className={'absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer'}
      onClick={setCurrentType}
      role="button"
    >
      {currentType === 'password' ? <IconOpenEye /> : <IconCloseEye />}
    </div>
  )
}
