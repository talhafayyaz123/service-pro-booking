import Tippy, { TippyProps } from '@tippyjs/react/headless'
import Image from 'next/image'
import { ReactNode, useMemo, useState } from 'react'

import { IconQrCode } from '@/assets/icons/icons'
import {
  ImgDevBarcode,
  ImgProdBarcode,
  ImgStagingBarcode,
} from '@/assets/images/images'
import { H14, H16 } from '@/components/typography'

const getQRCodeImage = () => {
  if (process.env.NEXT_PUBLIC_ENV === 'development') {
    return ImgDevBarcode
  }
  if (process.env.NEXT_PUBLIC_ENV === 'production') {
    return ImgProdBarcode
  }
  return ImgStagingBarcode
}

export const QRCode = ({
  children,
  ...props
}: Partial<TippyProps> & { children?: ReactNode }) => {
  const [showDropdown, setShowDropdown] = useState(false)

  const tippyProps: Partial<TippyProps> = useMemo(() => {
    return {
      placement: 'top',
      interactive: true,
      animation: false,
      appendTo: document.body,
      zIndex: 2,
      visible: showDropdown,
      onClickOutside: (_, event) => {
        event?.stopPropagation()
        setShowDropdown(false)
      },
      ...props,
    }
  }, [props, showDropdown])

  return (
    <Tippy
      {...tippyProps}
      render={(attrs) => (
        <div {...attrs} className={''}>
          <Content />
        </div>
      )}
    >
      <div
        role="none"
        onClick={() => {
          setShowDropdown((prev) => !prev)
        }}
      >
        {children ? (
          <div> {children}</div>
        ) : (
          <button
            className={
              'border z-[2] border-transparent focus:border-orange h-[48px] px-6 gap-2.5 flex items-center justify-center bg-white rounded-[12px] transition '
            }
          >
            <H16 color={'text-orange'} className={'whitespace-nowrap'}>
              Get the app
            </H16>
            <IconQrCode className={'text-orange'} />
          </button>
        )}
      </div>
    </Tippy>
  )
}

const Content = () => {
  const imageSrc = useMemo(() => getQRCodeImage(), [])

  return (
    <div
      className={
        'w-[205px] z-10 h-[240px] bg-white rounded-[24px] shadow-xl flex items-center justify-center'
      }
    >
      <div className={'flex flex-col '}>
        <Image alt={'qr-code'} src={imageSrc} width={142} height={142} />
        <H14 color={'text-black'} className={'mt-3'}>
          Scan me to Download
        </H14>
      </div>
    </div>
  )
}

export const Barcode = () => {
  const imageSrc = useMemo(() => getQRCodeImage(), [])

  return <Image alt={'qr-code'} src={imageSrc} width={142} height={142} />
}
