import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import { FaChevronLeft, FaChevronRight, FaStar } from 'react-icons/fa6'

import { IconMapMarkerWithoutShadow } from '@/assets/icons/icons'
import { ImgProUser } from '@/assets/images/images'
import { ROUTES } from '@/core/consts/routes'
import { cn } from '@/core/helpers/cn'
import { formatDistance } from '@/core/helpers/formatDistance'
import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { useAppSelector } from '@/hooks/hooks'
import { meSelector } from '@/store/me/meSelector'
import { ProCardProps } from '@/types/cardTypes'

const ProCard = ({
  id,
  slug,
  title,
  location,
  rating,
  images,
  profileImage,
  distance,
  width,
  height,
}: ProCardProps) => {
  const router = useRouter()
  const redirectFrom = getUrlWithSearchParams(router.pathname, router.query)

  const { country, email } = useAppSelector(meSelector)

  const [currentImageIndex, setCurrentImageIndex] = React.useState(0)
  const [isHovered, setIsHovered] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const nextImage = () => {
    setIsLoading(true)
    setCurrentImageIndex((prev) => (prev + 1) % (images?.length || 0))
  }

  const previousImage = () => {
    setIsLoading(true)
    setCurrentImageIndex(
      (prev) => (prev - 1 + (images?.length || 0)) % (images?.length || 0)
    )
  }

  // Truncate long titles
  const displayTitle = React.useMemo(() => {
    return title?.length > 44 ? `${title?.slice(0, 44)}...` : title
  }, [title])

  const getUrl = () => {
    const urlFromSearch = getUrlWithSearchParams(ROUTES.profile(slug || id), {
      redirectFrom,
    })
    const url = router.pathname.includes('search')
      ? urlFromSearch
      : ROUTES.profile(slug || id)
    return url
  }

  return (
    <a
      href={getUrl()}
      target={router.pathname.includes('search') ? '_blank' : '_self'}
      rel="noreferrer"
      className={'cursor-pointer hidden tablet:block'}
      draggable={false}
    >
      <div
        className={cn(
          'w-full max-w-md overflow-hidden mx-2.5',
          `w-[${width}px]`
        )}
      >
        <div className={cn('relative')}>
          {/* Image Carousel */}
          <div
            className="relative h-full w-full overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isLoading && (
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[20px]',
                  'animate-pulse bg-gray/50',
                  `w-[${width}px]`,
                  `h-[${height}px]`
                )}
              ></div>
            )}

            <Image
              src={images?.[currentImageIndex] || ''}
              alt={`${title} - Image ${currentImageIndex + 1}`}
              className={cn(
                'object-cover transition-transform duration-500 rounded-[20px]',
                isLoading ? 'opacity-0' : 'opacity-100'
              )}
              width={width}
              height={height}
              onLoadingComplete={() => setIsLoading(false)}
            />

            {/* Rating Badge - Only show if rating exists */}
            {rating !== undefined && rating !== null && rating > 0 && (
              <div className="absolute right-2 top-3 h-[32px] w-[67px] flex items-center justify-center gap-1 rounded-full bg-white py-3 shadow-[0px_4px_20px_0px_rgba(234, 234, 234, 1)]">
                <FaStar className="h-4 w-4 fill-current text-orange" />
                <span className="text-16 leading-6">{rating.toFixed(1)}</span>
              </div>
            )}

            {/* Navigation Arrows - Only show on hover */}
            {(images?.length ?? 0) > 1 && isHovered && (
              <>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    previousImage()
                  }}
                  className="absolute left-3 top-1/2 w-8 h-8 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-opacity duration-200 hover:bg-white"
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    nextImage()
                  }}
                  className="absolute right-3 top-1/2 w-8 h-8 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-opacity duration-200 hover:bg-white"
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </>
            )}

            {/* Dots Navigation - Only show if multiple images */}
            {(images?.length ?? 0) > 1 && (
              <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
                {images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentImageIndex(index)
                    }}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      currentImageIndex === index
                        ? 'bg-white'
                        : 'bg-white/40 hover:bg-white/80'
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Card Footer */}
        <div className="flex items-center gap-4 py-4">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={`${title} profile`}
              className="h-[60px] w-[60px] rounded-full object-cover"
              width={60}
              height={60}
            />
          ) : (
            <div
              className={
                'h-[60px] w-[60px] rounded-full overflow-hidden bg-[#EDDFFF] flex items-center justify-center'
              }
            >
              <Image
                alt={'alt pro icon'}
                src={ImgProUser}
                width={40}
                height={40}
              />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-wrap">{displayTitle}</h3>
            <div className="flex items-center gap-1 text-muted-foreground">
              <IconMapMarkerWithoutShadow className="h-4 w-4" />
              <span className="text-sm leading-6 truncate text-[#808080]">
                {email
                  ? `${formatDistance(distance as number, country)} from you`
                  : location}
              </span>
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

export default ProCard
