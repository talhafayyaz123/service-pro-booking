import Tippy, { TippyProps } from '@tippyjs/react/headless'
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'

import { IconChevronDropdown } from '@/assets/icons/icons'
import { DropdownContent } from '@/components/common/dropdown/DropdownContent'
import { DropdownContentWithRadio } from '@/components/common/dropdown/DropdownContentWithRadio'
import { IInputProps } from '@/components/common/Input'
import { LazyTippy } from '@/components/common/tooltip/LazyTipp'
import { Label } from '@/components/typography'
import { IOptions } from '@/types/common'

export interface IDropdownProps
  extends Omit<IInputProps, 'onChange' | 'value' | 'alternativeRender'> {
  options: IOptions[]
  onChange: (option: IOptions) => void
  onSearch?: ReactNode
  lazy?: boolean
  value?: IOptions
  showDropdownContent?: boolean
  maxWidth?: number
  wrapperClassName?: string
  alternativeRender?: (value?: IOptions) => ReactNode
  onClick?: () => void
  withRadio?: boolean
  tippyProps?: Partial<TippyProps>
}

export const NewDropdown = ({
  readOnly = false,
  disabled,
  options,
  onChange,
  className,
  onClick,
  onSearch,
  value,
  showDropdownContent = true,
  maxWidth,
  wrapperClassName,
  alternativeRender,
  withRadio,
  tippyProps,
  height,
  ...props
}: IDropdownProps) => {
  const dropdownAutoWidth = true
  const Component = props.lazy ? LazyTippy : Tippy
  const controlRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const getWidth = useCallback(() => {
    const controlWidth = controlRef.current?.clientWidth || 0
    return dropdownAutoWidth || !controlWidth ? 'auto' : controlWidth + 'px'
  }, [dropdownAutoWidth])
  const getMinWidth = useCallback(
    () =>
      maxWidth
        ? (maxWidth || 0).toString() + 'px'
        : (controlRef.current?.clientWidth || 0) + 'px',
    [maxWidth]
  )
  const [showDropdown, setShowDropdown] = useState(false)
  const popperOptions = useMemo<TippyProps>(
    () => ({
      placement: 'bottom-start',
      interactive: true,
      animation: false,
      appendTo: 'parent',
      onClickOutside: (_, event) => {
        event?.stopPropagation()
        setShowDropdown(false)
      },
      ...tippyProps,
    }),
    [tippyProps]
  )
  const handleControlClick = useCallback(() => {
    if (!disabled && !readOnly) {
      setShowDropdown((prev) => !prev)
    }
  }, [disabled, readOnly])

  const dropdownContentProps = useMemo(
    () => ({
      value: value || '',
      onChange,
      options: options.filter((el) => !!el?.value),
      sideEffect: () => setShowDropdown(false),
    }),
    [onChange, options, value]
  )

  return (
    <div className="w-full" ref={rootRef}>
      <Component
        {...popperOptions}
        maxWidth={maxWidth}
        visible={showDropdown}
        render={(attrs) => (
          <div {...attrs}>
            {showDropdownContent && (
              <div
                className="overflow-x-hidden bg-white border shadow-xs rounded-xl border-lightGray"
                style={{
                  width: maxWidth || getWidth(),
                  maxWidth: getMinWidth(),
                  minWidth: maxWidth || getMinWidth(),
                  height,
                }}
                ref={dropdownRef}
              >
                {onSearch && <div className="px-3">{onSearch}</div>}

                {!withRadio ? (
                  <DropdownContent {...dropdownContentProps} />
                ) : (
                  <DropdownContentWithRadio {...dropdownContentProps} />
                )}
              </div>
            )}
          </div>
        )}
      >
        <div
          className={wrapperClassName}
          role="none"
          onClick={() => {
            handleControlClick()
            onClick && onClick()
          }}
          data-open={showDropdown}
          ref={controlRef}
        >
          {props.label && (
            <Label
              className={`flex mb-2 ${props.labelClassName} overflow-hidden`}
            >
              {props.label}
            </Label>
          )}
          <DropdownView
            className={className}
            disabled={disabled}
            open={showDropdown}
          >
            {value?.value ? (
              alternativeRender ? (
                alternativeRender(value)
              ) : typeof value.label === 'function' ? (
                value.label(value)
              ) : (
                value.label
              )
            ) : (
              <span className={'text-gray text-14 font-normal leading-[18px]'}>
                {props.placeholder}
              </span>
            )}
          </DropdownView>
        </div>
      </Component>
    </div>
  )
}

const DropdownView = ({
  children,
  className,
  open,
  disabled,
}: {
  children: ReactNode
  open: boolean
  className?: string
  disabled?: boolean
}) => {
  return (
    <div
      className={`px-[12px] gap-[12px] flex-nowrap bg-white text-16 w-full flex items-center justify-between cursor-pointer transition font-normal leading-[22px] h-[50px] border  text-black rounded-xl ${
        open ? 'border-black' : 'border-lightGray'
      } ${disabled ? 'bg-lightGray' : ''} ${className}`}
    >
      <div className={`${disabled ? 'opacity-50' : ''}`}>{children}</div>
      <IconChevronDropdown
        className={`${open ? 'rotate-[180deg]' : ''}  ${
          disabled ? 'opacity-50' : ''
        } transition`}
      />
    </div>
  )
}
