import Tippy, { TippyProps } from '@tippyjs/react/headless'
import { ReactNode, useCallback, useMemo, useRef, useState } from 'react'

import { DropdownContent } from '@/components/common/dropdown/DropdownContent'
import { IInputProps, Input } from '@/components/common/Input'
import { LazyTippy } from '@/components/common/tooltip/LazyTipp'
import { IOptions } from '@/types/common'

export interface IDropdownProps
  extends Omit<IInputProps, 'onChange' | 'value'> {
  options: IOptions[]
  onChange: (option: IOptions) => void
  onSearch?: ReactNode
  lazy?: boolean
  value?: IOptions
  maxWidth?: number
  inputValue?: string
  onChangeInput?: (v: string) => void
  tippyProps?: TippyProps
  height?: number
  customContent?: ReactNode
}

export const Dropdown = ({
  readOnly = false,
  disabled,
  options,
  onChange,
  onSearch,
  value,
  inputClassName,
  maxWidth,
  customContent,
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
      ...props.tippyProps,
    }),
    [props.tippyProps]
  )
  const handleControlClick = useCallback(() => {
    if (!disabled && !readOnly) {
      setShowDropdown((prev) => !prev)
    }
  }, [disabled, readOnly])

  return (
    <div ref={rootRef}>
      <Component
        {...popperOptions}
        maxWidth={maxWidth}
        // className={'relative'}
        visible={showDropdown}
        render={(attrs) => (
          <div {...attrs}>
            <div
              className="overflow-x-hidden bg-white border shadow-xs rounded-xl border-lightGray"
              style={{
                width: maxWidth || getWidth(),
                maxWidth: getMinWidth(),
                minWidth: maxWidth || getMinWidth(),
              }}
              ref={dropdownRef}
            >
              {customContent && customContent}
              {onSearch && <div className={'px-3'}>{onSearch}</div>}

              <DropdownContent
                value={value || ''}
                onChange={onChange}
                options={options}
                sideEffect={() => setShowDropdown(false)}
              />
            </div>
          </div>
        )}
      >
        <div
          role="none"
          onClick={handleControlClick}
          data-open={showDropdown}
          ref={controlRef}
        >
          <Input
            {...props}
            value={
              typeof value?.label === 'string'
                ? value?.label
                : typeof options.filter((el) => el.value === value?.value)[0]
                    ?.label === 'string'
                ? (options.filter((el) => el.value === value?.value)[0]
                    ?.label as string)
                : value?.value
            }
            arrow
            inputClassName={`cursor-pointer ${inputClassName}`}
            // focusVisible={{ control: showDropdown, work: true }}
            disabled={disabled}
            tabIndex={0}
            readOnly
          />
        </div>
      </Component>
    </div>
  )
}
