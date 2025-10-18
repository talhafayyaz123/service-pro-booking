import Image from 'next/image'
import {
  memo,
  MouseEventHandler,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { IconFavorit, IconRedFavorit } from '@/assets/icons/icons'
import { MiniUserIcon } from '@/components/cardElements/MiniUserIcon'
import { H18, H20 } from '@/components/typography'
import { API_LINKS } from '@/core/consts/apiLinks'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { instance } from '@/store/instance'
import { IInspirationCard } from '@/types/instiprationTypes'

export const InspirationCard = ({
  contentUrl,
  isLoading = false,
  isFavorite,
  description,
  className,
  descriptionClassName = '!font-normal tablet:text-24 tablet:leading-[28px] mb-[14px]',
  spacingClassName = '',
  pro,
  id,
  onClick,
  disabledLike,
  imageSize,
}: Partial<IInspirationCard> & {
  className?: string
  spacingClassName?: string
  descriptionClassName?: string
  isLoading?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  disabledLike?: boolean
}) => {
  return (
    <div
      role={'none'}
      className={`h-full overflow-hidden shadow-xl  flex-shrink-0 w-full relative  bg-white rounded-[12px] border-[2px] border-white ${className}`}
      onClick={onClick}
    >
      {isLoading ? (
        <div className={'bg-lightGray animate-pulse w-full h-full'} />
      ) : (
        <>
          {contentUrl && (
            <div className={'absolute left-0 top-0'}>
              <div className={'maxDesktop:hidden'}>
                <Image
                  style={{
                    filter: 'brightness(0.7)',
                  }}
                  priority
                  quality={75}
                  alt={'inspiration'}
                  objectFit={'cover'}
                  width={imageSize?.desktop.width ?? 450}
                  height={imageSize?.desktop.height ?? 600}
                  src={contentUrl}
                />
              </div>
              <div className={'maxTablet:hidden desktop:hidden'}>
                <Image
                  style={{
                    filter: 'brightness(0.7)',
                  }}
                  priority
                  quality={75}
                  alt={'inspiration'}
                  objectFit={'cover'}
                  width={imageSize?.laptop.width ?? 450}
                  height={imageSize?.laptop.height ?? 600}
                  src={contentUrl}
                />
              </div>
              <div className={'tablet:hidden'}>
                <Image
                  style={{
                    filter: 'brightness(0.7)',
                  }}
                  priority
                  quality={75}
                  alt={'inspiration'}
                  objectFit={'cover'}
                  width={imageSize?.mobile.width ?? 400}
                  height={imageSize?.mobile.height ?? 500}
                  src={contentUrl}
                />
              </div>
            </div>
          )}

          <div
            className={`flex  relative z-10 backdrop-opacity-50 flex-col h-full justify-between p-[22px] tablet:p-[32px] tablet:pt-[24px] tablet:pr-[24px] ${spacingClassName}`}
          >
            <div className={'ml-auto'}>
              <LikeButton
                disabled={disabledLike}
                id={id}
                isFavorite={isFavorite}
              />
            </div>
            <div
              className={
                'mr-auto !flex flex-col max-h-[84px] tablet:max-h-[92px] h-full justify-between w-full'
              }
            >
              <H20
                color={'text-white'}
                className={`line-clamp-2 max-w-[75%] whitespace-pre-wrap ${descriptionClassName} `}
              >
                {description}
              </H20>
              <MiniUserIcon {...pro} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export const SimplifiedInspirationCard = ({
  contentUrl,
  isLoading = false,
  isFavorite,
  description,
  className,
  descriptionClassName = '!font-normal tablet:text-[18px]',
  spacingClassName = '',
  id,
  disabledLike,
}: Partial<IInspirationCard> & {
  className?: string
  spacingClassName?: string
  descriptionClassName?: string
  isLoading?: boolean
  disabledLike?: boolean
}) => {
  return (
    <div
      className={`overflow-hidden shadow-xl relative  bg-white rounded-[12px] border-[2px] border-white ${className}`}
    >
      {isLoading ? (
        <div className={'bg-lightGray animate-pulse w-full h-full '} />
      ) : (
        <>
          {contentUrl && (
            <div className={'overflow-hidden absolute h-full left-0 top-0'}>
              <Image
                style={{
                  filter: 'brightness(0.7)',
                }}
                priority
                quality={75}
                alt={'inspiration'}
                objectFit={'cover'}
                width={500}
                height={700}
                src={contentUrl}
              />
            </div>
          )}
          <div
            className={`flex  relative z-10 backdrop-opacity-50 flex-col h-full justify-between p-[14px] small:p-6 ${spacingClassName}`}
          >
            <div className={'ml-auto'}>
              <LikeButton
                disabled={disabledLike}
                id={id}
                isFavorite={isFavorite}
              />
            </div>
            <div
              className={
                'mr-auto !flex flex-col w-full h-[38px] small:h-12 max-w-[70%] justify-start'
              }
            >
              <H18
                color={'text-white'}
                className={`line-clamp-2 max-w-full whitespace-pre-wrap maxSmall:!text-14 maxSmall:leading-[18px] ${descriptionClassName} `}
              >
                {description}
              </H18>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const LikeButton = memo(
  ({
    isFavorite,
    id,
    disabled,
  }: {
    isFavorite?: boolean
    id?: string
    disabled?: boolean
  }) => {
    const [favorine, setFavorite] = useState(isFavorite)
    const [status, setStatus] = useState(false)
    const authGuard = useAuthGuard()

    useEffect(() => {
      setFavorite(isFavorite)
    }, [isFavorite])

    const onFavorite = useCallback(async () => {
      try {
        setStatus(true)
        const data = await instance.post<IInspirationCard>(
          API_LINKS.favoriteInspiration(id || '')
        )
        await setFavorite(data.data.isFavorite)
        await setStatus(false)
        return data
      } catch (e) {
        await setStatus(false)
        return Promise.reject(e)
      }
    }, [id])

    const handleFavorite = useCallback(() => {
      if (disabled) {
        return
      }
      authGuard(() => {
        onFavorite()
        setFavorite((prevState) => !prevState)
      })
    }, [authGuard, disabled, onFavorite])

    return (
      <button
        disabled={status}
        onClick={handleFavorite}
        className={
          'h-[40px] select-none w-[40px] bg-white rounded-full flex items-center justify-center transition-all cursor-pointer group hover:shadow-xl'
        }
      >
        {!favorine ? <IconFavorit /> : <IconRedFavorit className={`m-auto`} />}
      </button>
    )
  }
)
