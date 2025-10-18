import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { IconAllImages } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { CircleButton } from '@/components/common/buttons/CircleButton'
import { H16, H28 } from '@/components/typography'
import { profileSelector } from '@/features/profile/store/profileSelectors'

const ProfileMasonryGrid = () => {
  const { data } = useSelector(profileSelector)
  const images = data.photos

  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [isSeeAllImagesOpen, setIsSeeAllImagesOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fromSeeAllImages, setFromSeeAllImages] = useState(false)

  useEffect(() => {
    if (fromSeeAllImages) {
      setIsSeeAllImagesOpen(false)
      setIsGalleryOpen(true)
    }
  }, [fromSeeAllImages])

  if (!images?.length) return null

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index)
    setIsGalleryOpen(true)
  }

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  // If there are only two images, display them side by side
  if (images.length === 2) {
    return (
      <>
        <div className="min-h-[400px] h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 h-full">
            {images.map((image, index) => (
              <div key={index} className="relative h-full">
                <div
                  className={`bg-gray-200 h-full overflow-hidden ${
                    index === 0 ? 'rounded-l-3xl' : 'rounded-r-3xl'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    layout="fill"
                    className={`${
                      index === 0 ? 'rounded-l-3xl' : 'rounded-r-3xl'
                    } object-cover cursor-pointer`}
                    onClick={() => handleImageClick(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-[#202020]">
            {/* Header */}
            <header className="fixed top-0 z-50 left-0 right-0 h-20 bg-white flex items-center px-4 md:px-8">
              <div className="w-fit border rounded-xl border-lightGray cursor-pointer">
                <Button
                  size="42"
                  buttonType="withIcon"
                  onClick={() => {
                    if (fromSeeAllImages) {
                      setIsGalleryOpen(false)
                      setFromSeeAllImages(false)
                    } else {
                      setIsGalleryOpen(false)
                    }
                  }}
                  className="cursor-pointer"
                >
                  Back
                </Button>
              </div>
              <H28 className="flex-1 text-center text-xl font-semibold">
                {data.name}
              </H28>
              <div className="w-[100px]" /> {/* Spacer */}
            </header>

            {/* Gallery Content */}
            <div className="fixed inset-0 pt-20 pb-4 flex items-center justify-center">
              <div className="relative w-full h-full max-w-7xl mx-auto px-16 md:px-24 flex items-center">
                {/* Previous Button */}
                <CircleButton
                  onClick={handlePrevious}
                  className="absolute left-8 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  aria-label="Previous image"
                />
                {/* Image Container */}
                <div className="w-full h-full flex items-center justify-center p-4">
                  <div className="relative w-full h-[calc(100%-theme(spacing.6))] md:h-[calc(100%-theme(spacing.24))] overflow-hidden rounded-2xl">
                    <Image
                      src={images[currentImageIndex]}
                      alt={`Gallery image ${currentImageIndex + 1}`}
                      className="object-contain"
                      layout="fill"
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                    />
                  </div>
                </div>

                {/* Next Button */}
                <CircleButton
                  onClick={handleNext}
                  className="rotate-180 absolute right-8 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                  aria-label="Next image"
                />
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  // Default layout for 3 or more images
  return (
    <>
      <div className="relative min-h-[400px] h-full">
        <div className="grid grid-cols-3 md:grid-cols-3 gap-3 h-full">
          {/* Left column - large image */}
          <div className="relative h-full col-span-2">
            <div className="h-full rounded-l-3xl overflow-hidden">
              <Image
                src={images[0]}
                alt="Main gallery image"
                layout="fill"
                className="w-full h-full object-cover rounded-l-3xl cursor-pointer"
                onClick={() => handleImageClick(0)}
              />
            </div>
          </div>

          {/* Right column - stacked images */}
          <div className="flex flex-col gap-3 col-span-1 h-full">
            {images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative flex-1">
                <div
                  className={`bg-gray-200 h-full overflow-hidden ${
                    index === 0 ? 'rounded-tr-3xl' : 'rounded-br-3xl'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 2}`}
                    layout="fill"
                    className={`w-full h-full object-cover ${
                      index === 0 ? 'rounded-tr-3xl' : 'rounded-br-3xl'
                    } cursor-pointer`}
                    onClick={() => handleImageClick(index + 1)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {images.length > 3 && (
          // eslint-disable-next-line jsx-a11y/no-static-element-interactions
          <div
            className="absolute bottom-6 right-4"
            onClick={() => setIsSeeAllImagesOpen(true)}
          >
            <Button
              icon={<IconAllImages className="w-5 h-5" />}
              size="40"
              buttonType="withIcon"
              className="!rounded-full space-x-1 !flex flex-row justify-center items-center
      "
            >
              <H16>See all images</H16>
            </Button>
          </div>
        )}
      </div>

      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 bg-[#202020]">
          {/* Header */}
          <header className="fixed top-0 z-50 left-0 right-0 h-20 bg-white flex items-center px-4 md:px-8">
            <div className="w-fit border rounded-xl border-lightGray cursor-pointer">
              <Button
                size="42"
                buttonType="withIcon"
                onClick={() => {
                  if (fromSeeAllImages) {
                    setIsGalleryOpen(false)
                    setFromSeeAllImages(false)
                  } else {
                    setIsGalleryOpen(false)
                  }
                }}
                className="cursor-pointer"
              >
                Back
              </Button>
            </div>
            <H28 className="flex-1 text-center text-xl font-semibold">
              {data.name}
            </H28>
            <div className="w-[100px]" /> {/* Spacer */}
          </header>

          {/* Gallery Content */}
          <div className="fixed inset-0 pt-20 pb-4 flex items-center justify-center">
            <div className="relative w-full h-full max-w-7xl mx-auto px-16 md:px-24 flex items-center">
              {/* Previous Button */}
              <CircleButton
                onClick={handlePrevious}
                className="absolute left-8 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                aria-label="Previous image"
              />
              {/* Image Container */}
              <div className="w-full h-full flex items-center justify-center p-4">
                <div className="relative w-full h-[calc(100%-theme(spacing.6))] md:h-[calc(100%-theme(spacing.24))] overflow-hidden rounded-2xl">
                  <Image
                    src={images[currentImageIndex]}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    className="object-contain"
                    layout="fill"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              </div>

              {/* Next Button */}
              <CircleButton
                onClick={handleNext}
                className="rotate-180 absolute right-8 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                aria-label="Next image"
              />
            </div>
          </div>
        </div>
      )}

      {isSeeAllImagesOpen && (
        <div className="fixed inset-0 left-0 right-0 top-0 bg-white z-[1000] flex flex-col items-center justify-center">
          <div className="absolute z-50 top-0 left-0 px-20 bg-white w-full h-[82px] flex justify-between items-center drop-shadow-lg">
            <div className="w-fit border rounded-xl border-lightGray">
              <Button
                size="42"
                buttonType="withIcon"
                onClick={() => {
                  setFromSeeAllImages(false)
                  setIsSeeAllImagesOpen(false)
                }}
              >
                Back
              </Button>
            </div>

            <div>
              <H28>{data.name}</H28>
            </div>
            <div></div>
          </div>
          <div className="w-full overflow-y-auto p-8 mt-20">
            <div className="grid grid-rows-3 gap-10 max-w-5xl mx-auto">
              {images.map((image, index) => (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                  key={index}
                  className="relative aspect-[4/3] cursor-pointer"
                  onClick={() => {
                    setCurrentImageIndex(index)
                    setFromSeeAllImages(true)
                  }}
                >
                  <Image
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-xl"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default ProfileMasonryGrid
