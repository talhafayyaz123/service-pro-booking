import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react'

import { ImgEmojiPresent } from '@/assets/images/images'
import { TTextColors } from '@/types/typo'

interface ITypography
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  children?: ReactNode
  className?: string
  bold?: boolean
  font?: string
  color?: TTextColors
  responsive?: boolean
  required?: boolean
}

export const H12 = ({
  children,
  color = 'text-gray',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <span
      {...rest}
      className={`${color} text-[12px] font-normal leading-[18px] ${className}`}
    >
      {children}
    </span>
  )
}

export const H14 = ({
  children,
  color = 'text-gray',
  className = '',
  font,
  ...rest
}: ITypography) => {
  return (
    <span
      {...rest}
      className={`${color} ${font} text-14 font-normal leading-[18px] ${className}`}
    >
      {children}
    </span>
  )
}

export const H16 = ({
  children,
  color = 'text-black',
  className = '',
  responsive,
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`${color} ${
        responsive
          ? 'small:leading-[22px] small:text-16 text-14 leading-[18px]'
          : 'leading-[22px] text-16'
      } font-normal block  ${className}`}
    >
      {children}
    </p>
  )
}

export const H18 = ({
  children,
  color = 'text-black',
  className = '',
  font = 'font-normal',
  ...rest
}: ITypography) => {
  return (
    <p {...rest} className={`${color} ${font} leading-6 text-18  ${className}`}>
      {children}
    </p>
  )
}
export const H18WithRequired = ({
  children,
  color = 'text-black',
  className = '',
  font = 'font-normal',
  required,
  ...rest
}: ITypography) => {
  return (
    <p {...rest} className={`${color} ${font} leading-6 text-18  ${className}`}>
      {children}
      {required && <span className={'text-red-500'}>*</span>}
    </p>
  )
}

export const H20 = ({
  children,
  color = 'text-black',
  className = '',
  font,
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`${color} ${font} leading-7 text-20 font-bold  ${className}`}
    >
      {children}
    </p>
  )
}
export const H20WithRequired = ({
  children,
  color = 'text-black',
  className = '',
  required,
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`${color} leading-7 text-20 font-bold  ${className}`}
    >
      {children} {required && <span className={'text-red-500'}>*</span>}
    </p>
  )
}

export const H24 = ({
  children,
  color = 'text-black',
  className = '',
  responsive = false,
  ...rest
}: ITypography) => {
  return (
    <span
      {...rest}
      className={`${
        responsive
          ? 'small:text-24 small:leading-8 text-16 leading-6'
          : 'text-24 leading-8'
      } ${color} font-bold ${className}`}
    >
      {children}
    </span>
  )
}

export const H28 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <span
      {...rest}
      className={` text-28 ${color} font-bold leading-8 ${className}`}
    >
      {children}
    </span>
  )
}

export const H32 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`small:text-32 ${color} small:leading-10 text-24 leading-9 font-normal ${className}`}
    >
      {children}
    </p>
  )
}

export const H34 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[34px] ${color} small:leading-10 tracking-[-0.5px] leading-9 font-normal ${className}`}
    >
      {children}
    </p>
  )
}

export const H38 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[38px] ${color} leading-[44px] font-bold ${className}`}
    >
      {children}
    </p>
  )
}

export const H40 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-28 leading-[34px] tablet:text-[40px] ${color} tablet:leading-[48px] font-normal ${className}`}
    >
      {children}
    </p>
  )
}

export const H42 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[42px] ${color} leading-[46px] font-normal ${className}`}
    >
      {children}
    </p>
  )
}

export const H48 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[36px] leading-[34px] tablet:text-[48px] ${color} tablet:leading-[56px] font-normal ${className}`}
    >
      {children}
    </p>
  )
}

export const H64 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[30px] leading-[23px] tablet:text-[64px] ${color} tablet:leading-[72px] font-semibold ${className}`}
    >
      {children}
    </p>
  )
}

export const H80 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`text-[80px] ${color} leading-[84px] font-bold ${className}`}
    >
      {children}
    </p>
  )
}

export const ErrorMessage = ({
  children,
  className = '',
  ...rest
}: ITypography) => {
  return (
    <H12 {...rest} className={` !text-orange leading-4 ${className} `}>
      {children}
    </H12>
  )
}

export const Label = ({ children, className = '', ...rest }: ITypography) => {
  return (
    <H16 {...rest} className={`text-black font-normal ${className}`} responsive>
      {children}
    </H16>
  )
}

export const Title18 = ({
  children,
  color = 'text-black',
  className = '',
  ...rest
}: ITypography) => {
  return (
    <p
      {...rest}
      className={`${color} leading-6 text-16 small:text-18 font-normal  ${className}`}
    >
      {children}
    </p>
  )
}

export const OrangeBlock = ({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) => {
  return (
    <div className={`p-3 flex  bg-yellow gap-x-2.5 rounded-xl ${className}`}>
      <img
        className={'h-[22px]   w-[22px]'}
        src={ImgEmojiPresent.src}
        alt="emoji"
      />
      {typeof children === 'string' ? (
        <H18 className={'maxTablet:!text-16 maxTablet:!leading-[22px]'}>
          {children}
        </H18>
      ) : (
        children
      )}
    </div>
  )
}
