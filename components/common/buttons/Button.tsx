import classNames from 'classnames'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  MouseEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { H14 } from '@/components/typography'
import { TColorsType, TSize } from '@/types/common'
import { TTextColors } from '@/types/typo'

export interface IButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  buttonType?: TColorsType
  size?: TSize
  icon?: ReactNode
  reff?: any
  textClassName?: string
  leftIcon?: ReactNode
  isLoading?: boolean
}

export const Button = ({
  children,
  className,
  onClick,
  buttonType = 'white',
  size = '50',
  disabled,
  leftIcon,
  reff,
  icon,
  type = 'button',
  textClassName = '',
  isLoading,
  ...rest
}: IButton) => {
  const { isRippling, coords, handleClick } = useButtonEffect()
  const { buttonConfig, buttonSize } = useButtonConfig(disabled)
  return (
    <button
      disabled={disabled || isLoading}
      type={type}
      ref={reff}
      {...rest}
      onClick={(e) => {
        if (disabled || isLoading) {
          return
        }
        handleClick(e)
        onClick && onClick(e)
      }}
      className={`relative  overflow-hidden border outline-none  ripple-button rounded-xl  transition duration-300 ${
        buttonConfig[buttonType].button
      } ${buttonSize[size].button} ${
        disabled ? 'opacity-60  cursor-not-allowed ' : ''
      } 
       ${className}`}
    >
      {isLoading && (
        <div
          className={
            'w-full h-full left-0 top-0 absolute flex items-center justify-center '
          }
        >
          <div className={'loader_spinner_mini_white'} />
        </div>
      )}
      {isRippling && (
        <div
          className={classNames(
            'w-5 h-5 absolute rounded-full',
            buttonConfig[buttonType].rippling,
            { ['opacity-0']: isLoading }
          )}
          style={{
            left: coords.x,
            top: coords.y,
          }}
        />
      )}
      <div
        className={classNames(
          'flex items-center pointer-events-none gap-2.5 justify-center',
          { ['opacity-0']: isLoading },
          { ['justify-between']: buttonType === 'withIcon' }
        )}
      >
        {leftIcon ?? leftIcon}
        {buttonType === 'withIcon' ? <div>{icon}</div> || <div /> : undefined}
        <H14
          color={buttonConfig[buttonType].text as TTextColors}
          className={`relative z-2 !font-bold whitespace-nowrap  ${buttonSize[size].text} ${textClassName}`}
        >
          {children}
        </H14>
        {buttonType === 'withIcon' && <div />}
      </div>
    </button>
  )
}

const useButtonEffect = () => {
  const [coords, setCoords] = useState({ x: -1, y: -1 })
  const [isRippling, setIsRippling] = useState(false)

  useEffect(() => {
    if (coords.x !== -1 && coords.y !== -1) {
      setIsRippling(true)
      setTimeout(() => setIsRippling(false), 450)
    } else setIsRippling(false)
  }, [coords])

  useEffect(() => {
    if (!isRippling) setCoords({ x: -1, y: -1 })
  }, [isRippling])

  const handleClick = useCallback((e: MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return {
    handleClick,
    coords,
    isRippling,
  }
}

const useButtonConfig = (disabled?: boolean) => {
  const buttonSize: Record<TSize, { button: string; text: string }> = {
    '25': {
      button: 'px-6 h-12',
      text: '',
    },
    '36': {
      button: 'px-6 h-[36px] rounded-[8px]',
      text: '!text-14',
    },
    '50': {
      button: 'px-6 h-[50px]',
      text: '',
    },
    '46': {
      button: 'px-6 h-[46px]',
      text: '',
    },
    '44': {
      button: 'px-6 h-[44px] ',
      text: '',
    },
    '40': {
      button: 'px-5 h-[40px] !border-0',
      text: 'font-normal',
    },
    '42': {
      button: 'px-5 h-[42px] !border-0',
      text: 'font-normal',
    },
    '100': {
      button: 'px-6 h-[50px]',
      text: '',
    },
    '200': {
      button: 'h-[56px] px-6',
      text: 'leading-[22px] !text-16',
    },
    '300': {
      button: '',
      text: '',
    },
  }

  const buttonConfig = useMemo(
    () => ({
      white: {
        button: `bg-white shadow-base border-lightGray  ${
          disabled ? 'bg-lightGray' : 'hover:bg-lightGray'
        } `,
        rippling: `white_gradient`,
        text: '!text-orange',
      },
      text: {
        button: ` border-none !p-0 !h-fit`,
        rippling: ``,
        text: `${disabled ? '!text-gray' : '!text-orange hover:!text-black'}`,
      },
      lightMain: {
        button: `bg-lightMain shadow-base border-lightMain  ${
          disabled
            ? 'bg-lightGray'
            : 'hover:bg-lightGray hover:border-lightGray'
        } `,
        rippling: `orange_gradient`,
        text: 'text-orange',
      },
      default: {
        button: `!bg-white !border-lightGray  ${
          disabled ? '!bg-lightGray' : 'hover:!bg-lightGray'
        } `,
        rippling: `white_gradient`,
        text: '!text-orange',
      },
      orange: {
        button: `bg-orange  border-orange hover:shadow-base  ${
          disabled ? '' : 'hover:bg-orange1 '
        }`,
        rippling: `orange_gradient`,
        text: '!text-white',
      },
      withIcon: {
        button: `bg-white  border-lightGray  ${
          disabled ? 'bg-lightGray' : '  hover:bg-lightGray hover:shadow-base'
        }`,
        rippling: `white_gradient`,
        text: '!text-black  ',
      },
      icon: {
        button: `bg-white border-none shadow-iconButton rounded-full !h-10 !w-10 !p-0  ${
          disabled ? '' : 'hover:bg-lightGray'
        }`,
        rippling: `white_gradient`,
        text: 'text-white',
      },
      '3d': {
        button: `bg-orange  border-orange shadow-3d  ${
          disabled ? '' : 'hover:bg-orange1 '
        }`,
        rippling: `orange_gradient`,
        text: 'text-white',
      },
      link: {
        button: `!border-0 group !p-0 h-fit rounded-none ${
          disabled ? '' : ' '
        }`,
        rippling: ``,
        text: 'text-orange group-hover:!text-orange1 transition',
      },
    }),
    [disabled]
  )
  return { buttonSize, buttonConfig }
}
