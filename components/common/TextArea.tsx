import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import TextareaAutosize, {
  TextareaAutosizeProps,
} from 'react-textarea-autosize'

import { Button } from '@/components/common/buttons/Button'
import { ErrorMessage, H14, Label } from '@/components/typography'
import { IOptions, TSize } from '@/types/common'

export interface ITextAreaProps
  extends Omit<
    DetailedHTMLProps<
      InputHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    'size' | 'value' | 'ref'
  > {
  size?: TSize
  label?: ReactNode
  value?: string | IOptions
  rows?: number
  error?: string | boolean
  labelClassName?: string
  alternativeRender?: (value: IOptions | string) => ReactNode
  inputClassName?: string
  count?: boolean
  onClickEnter?: () => void
}

const TextArea = ({
  className,
  size = '50',
  alternativeRender,
  error,
  inputClassName = '',
  label,
  labelClassName = '',
  rows = 3,
  count,
  onClickEnter,
  ...rest
}: ITextAreaProps & TextareaAutosizeProps) => {
  const classes = `bg-white text-16 font-normal leading-[22px] border border-lightGray ${
    alternativeRender ? 'text-white' : 'text-black'
  }  outline-0  rounded-xl ${
    rest.disabled || rest.readOnly
      ? 'cursor-default'
      : 'focus-visible:border-black'
  }   block w-full transition duration-150`
  const inputConfig = useInputConfig(false, !!onClickEnter)

  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault()
        onClickEnter && onClickEnter()
        // callMyFunction();
      }
    }
    if (onClickEnter) {
      document.addEventListener('keydown', listener)
    }

    return () => {
      document.removeEventListener('keydown', listener)
    }
  }, [onClickEnter])
  return (
    <div className={className}>
      {label && (
        <Label className={`flex mb-2 ${labelClassName} overflow-hidden`}>
          {label}
        </Label>
      )}
      <div className={'relative '}>
        <div className={''}>
          <TextareaAutosize
            {...rest}
            placeholder={alternativeRender ? '' : rest.placeholder}
            value={alternativeRender ? '' : (rest.value as string)}
            autoComplete="new-password"
            className={` resize-none    ${classes} ${inputConfig[size]}  ${
              error ? '!border-orange' : ''
            } ${inputClassName}`}
            rows={rows}
          />
          {count && (
            <H14 className={'absolute bottom-3 right-3'}>
              {(rest.value || '').toString().length} / {rest.maxLength}
            </H14>
          )}
          {!!onClickEnter && (rest.value as string)?.length > 0 && (
            <div className={'absolute right-[12px] bottom-[4px] '}>
              <Button
                ref={ref}
                onClick={onClickEnter}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    e.stopPropagation()
                    onClickEnter()
                  }
                }}
                buttonType={'link'}
              >
                Enter
              </Button>
            </div>
          )}
          {alternativeRender && (
            <div
              className={
                'absolute top-1/2  left-5 cursor-pointer  transform  -translate-y-1/2 bg-white'
              }
            >
              {alternativeRender(rest.value as IOptions)}
            </div>
          )}
        </div>
      </div>
      {error && typeof error === 'string' && error?.length > 0 ? (
        <ErrorMessage className={'block text-left mt-1'}>{error}</ErrorMessage>
      ) : undefined}
    </div>
  )
}

export default TextArea

const useInputConfig = (arrow: boolean, onClickEnter?: boolean) => {
  const rightSpace = arrow ? 'pr-[50px]' : onClickEnter ? '!pr-[60px]' : ''
  return useMemo(
    () => ({
      '25': `py-2 px-5 ${rightSpace}`,
      '36': '',
      '46': '',
      '40': '',
      '42': '',
      '44': `px-5 py-[10px] ${rightSpace}`,
      '50': `px-5 py-[13px] ${rightSpace}`,
      '100': `${rightSpace}`,
      '200': `px-5 py-3.5 ${rightSpace}`,
      '300': '',
    }),
    [rightSpace]
  )
}
