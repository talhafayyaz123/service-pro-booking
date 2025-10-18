import Image from 'next/image'

import {
  ImgGooglePlay,
  ImgGreyGooglePlay,
  ImgNewGooglePlay,
} from '@/assets/images/images'
import { useStoreLinks } from '@/hooks/useStoreLinks'

export const GooglePlayLink = () => {
  const { handlePlayStoreClick } = useStoreLinks()

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handlePlayStoreClick()
      }}
      target="_blank"
      rel="noreferrer"
      className="outline-none flex cursor-pointer"
      role={'link'}
    >
      <Image
        quality={80}
        src={ImgGooglePlay.src}
        height={44}
        width={150}
        alt="google"
      />
    </a>
  )
}

export const NewGooglePlayLink = () => {
  const { handlePlayStoreClick } = useStoreLinks()

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handlePlayStoreClick()
      }}
      className="outline-none flex"
      target="_blank"
      rel="noreferrer"
      role={'link'}
    >
      <Image
        src={ImgNewGooglePlay}
        width={135}
        height={40}
        alt="Download the app on google play"
      />
    </a>
  )
}

export const GreyGooglePlayLink = () => {
  const { handlePlayStoreClick } = useStoreLinks()

  return (
    <a
      onClick={(e) => {
        e.preventDefault()
        handlePlayStoreClick()
      }}
      target="_blank"
      rel="noreferrer"
      role={'link'}
      className="cursor-pointer"
    >
      <Image
        src={ImgGreyGooglePlay}
        width={142}
        height={42}
        alt="Get it on Google Play"
      />
    </a>
  )
}
