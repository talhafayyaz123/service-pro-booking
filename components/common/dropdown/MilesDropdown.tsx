import Tippy, { TippyProps } from '@tippyjs/react/headless'
import {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'

import { IconArrow } from '@/assets/icons/icons'
import { DropdownContent } from '@/components/common/dropdown/DropdownContent'
import { IInputProps, Input } from '@/components/common/Input'
import { LazyTippy } from '@/components/common/tooltip/LazyTipp'
import { H16 } from '@/components/typography'
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
  isMiles?: boolean
}

export const MilesDropdown = ({
  readOnly = false,
  disabled,
  options,
  onChange,
  onSearch,
  value,
  inputClassName,
  maxWidth,
  isMiles,
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

  const onInputChange = useCallback(
    (_: ChangeEvent<HTMLInputElement>) => {
      const v = _.target.value
      const n = Number(v)
      if (
        !isNaN(n) &&
        (v.length > 1 ? (v.startsWith('0') ? v[1] === '.' : true) : true) &&
        !v.startsWith('0.00') &&
        (v.startsWith('0') ? v.length < 5 : true)
      ) {
        onChange({
          label: v,
          value: n,
        })
      }
    },
    [onChange]
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
    }),
    []
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
        visible={showDropdown}
        render={(attrs) => (
          <div {...attrs}>
            <div
              className="rounded-xl shadow-xs bg-white border border-lightGray overflow-x-hidden"
              style={{
                width: maxWidth || getWidth(),
                maxWidth: getMinWidth(),
                minWidth: maxWidth || getMinWidth(),
              }}
              ref={dropdownRef}
            >
              {onSearch && <div className={'px-3'}>{onSearch}</div>}
              <DropdownContent
                value={value || ''}
                onChange={(o) => {
                  const sV = o.value.toString()
                  onChange({
                    label: sV,
                    value: o.value,
                  })
                }}
                itemClassName="pl-6 py-1.5 mb-1.5"
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
          className="relative"
        >
          <Input
            {...props}
            style={{
              boxShadow: showDropdown
                ? '0px 4px 27px rgba(182, 190, 206, 0.3)'
                : '',
            }}
            value={typeof value?.label === 'string' ? value?.label : ''}
            inputClassName={`${inputClassName} pr-[110px]`}
            noBorder
            disabled={disabled}
            tabIndex={0}
            onChange={onInputChange}
            onKeyDown={(_) => {
              if (_.key === 'Enter') {
                setShowDropdown(false)
              }
            }}
          />
          <div className="absolute right-4 top-[31px] flex items-center h-[48px] border-l border-lightGray">
            <H16 className="pl-4 mr-5">{isMiles ? 'miles' : 'km.'}</H16>
            <IconArrow
              className={`w-[18px] h-[18px] stroke-black ${
                showDropdown ? 'rotate-90' : '-rotate-90'
              } transition-transform`}
            />
          </div>
        </div>
      </Component>
    </div>
  )
}
