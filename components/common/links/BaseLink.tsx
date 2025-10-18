import Link from 'next/link'
import { ReactNode, useMemo } from 'react'

import { H14 } from '@/components/typography'
import { TSize } from '@/types/common'

interface IProps {
  type?: 'link' | 'button'
  href?: string
  linkType?: 'orange' | 'black'
  children: ReactNode
  onClick?: () => void
  size?: TSize
  line?: boolean
  className?: string
  textClassName?: string
}

export const BaseLink = ({
  line = true,
  type = 'link',
  linkType = 'orange',
  onClick,
  size = '50',
  children,
  ...rest
}: IProps) => {
  return (
    <>
      {type === 'link' && (
        <TypeLink
          onClick={onClick}
          size={size}
          line={line}
          linkType={linkType}
          {...rest}
        >
          {children}
        </TypeLink>
      )}
      {type === 'button' && (
        <ButtonType
          onClick={onClick}
          size={size}
          line={line}
          linkType={linkType}
          {...rest}
        >
          {children}
        </ButtonType>
      )}
    </>
  )
}

const TypeLink = ({
  href,
  children,
  linkType,
  onClick,
  line,
  size = '50',
  className,
  textClassName,
}: IProps) => {
  const { linkConfig, linkSize } = useLinkConfig(textClassName)
  return (
    <Link href={href || '#'}>
      <a role={'link'} onClick={onClick}>
        <H14
          className={` ${linkSize[size]} overflow-hidden   ${
            linkConfig[linkType || 'orange'].text
          } ${className}`}
        >
          {children}
          {line && (
            <div
              className={`h-px w-full left-0 absolute z-0 bottom-px transition duration-150 ${
                linkConfig[linkType || 'orange'].line
              }`}
            />
          )}
        </H14>
      </a>
    </Link>
  )
}

const ButtonType = ({
  children,
  linkType,
  onClick,
  line,
  size = '50',
  className,
  textClassName,
}: IProps) => {
  const { linkConfig, linkSize } = useLinkConfig(textClassName)

  return (
    <H14
      onClick={onClick}
      className={` ${linkSize[size]} overflow-hidden relative pb-0.5 ${
        linkConfig[linkType || 'orange'].text
      } ${className}`}
    >
      {children}
      {line && (
        <div
          className={`h-px w-full left-0 absolute bottom-px  transition duration-150 ${
            linkConfig[linkType || 'orange'].line
          }`}
        />
      )}
    </H14>
  )
}

const useLinkConfig = (textClassName?: string) => {
  const linkSize: Record<TSize, string> = useMemo(
    () => ({
      '25': '',
      '36': '',
      '46': '',
      '44': '',
      '40': '',
      '42': '',
      '50': '',
      '100': '',
      '200': '!text-16',
      '300': '!text-18 leading-[24px]',
    }),
    []
  )
  const linkConfig = useMemo(
    () => ({
      orange: {
        text: `!text-orange !font-bold  hover:text-orange1 relative transition duration-150 cursor-pointer group ${textClassName}`,
        line: 'bg-orange group-hover:bg-orange1',
      },
      black: {
        text: `!text-black !font-bold  hover:text-orange relative transition duration-150 cursor-pointer group ${textClassName}`,
        line: 'bg-black group-hover:bg-orange',
      },
    }),
    [textClassName]
  )
  return { linkConfig, linkSize }
}
