import Image from 'next/image'

import {
  ImgAppleStore,
  ImgAppleStoreWhite,
  ImgGreyAppleStore,
  ImgNewAppStore,
} from '@/assets/images/images'
import { useStoreLinks } from '@/hooks/useStoreLinks'

export const ApplePayLink = ({ type }: { type: 'white' | 'black' }) => {
  const { handleAppStoreClick } = useStoreLinks()
  const src = {
    white: ImgAppleStoreWhite.src,
    black: ImgAppleStore.src,
  }

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handleAppStoreClick()
      }}
      target="_blank"
      rel="noreferrer"
      className="outline-none flex cursor-pointer"
      role={'link'}
    >
      <Image
        className={'pt-[1px]'}
        src={src[type]}
        objectFit={'cover'}
        height={45}
        width={135}
        alt="apple"
      />
    </a>
  )
}

export const NewAppStoreLink = () => {
  const { handleAppStoreClick } = useStoreLinks()
  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handleAppStoreClick()
      }}
      className="outline-none flex"
      target="_blank"
      rel="noreferrer"
      role={'link'}
    >
      <Image
        src={ImgNewAppStore}
        width={135}
        height={40}
        alt="Download the app on app store"
      />
    </a>
  )
}

export const GreyAppleStoreLink = () => {
  const { handleAppStoreClick } = useStoreLinks()

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handleAppStoreClick()
      }}
      target="_blank"
      rel="noreferrer"
      role={'link'}
      className="cursor-pointer"
    >
      <Image
        src={ImgGreyAppleStore}
        width={142}
        height={42}
        alt="Download on the App Store"
      />
    </a>
  )
}
