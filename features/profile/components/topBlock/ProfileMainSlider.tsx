import { memo, useRef } from 'react'
import { useSelector } from 'react-redux'
import Slider, { Settings } from 'react-slick'

import { IconShareBlack } from '@/assets/icons/icons'
import { BackButton } from '@/components/common/buttons/BackButton'
import { CircleButton } from '@/components/common/buttons/CircleButton'
import { MODALS_TYPE } from '@/core/consts/common'
import { useSlickSliderFunctional } from '@/features/homePage/HorizontalSlider'
import {
  ProfileSlide,
  ProfileSlideImage,
} from '@/features/profile/components/topBlock/ProfileSlide'
import { useIsPreviewProfile } from '@/features/profile/hooks/useIsPreviewProfile'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppDispatch } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const ProfileMainSlider = memo(() => {
  const { data } = useSelector(profileSelector)

  const slickRef = useRef<Slider>(null)

  const { slickNext, slickPrev, settings, currentSlide, onClickDot } =
    useSlickSliderFunctional(slickRef)

  const dispatch = useAppDispatch()

  const sliderSettings: Settings = {
    afterChange: settings.afterChange,
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    variableWidth: false,
  }
  const isPreviewProfile = useIsPreviewProfile()

  return (
    <div>
      <div className="mx-auto relative small:mt-[60px] small:container overflow-x-hidden tablet:hidden">
        <div
          style={{ transform: 'translateZ(0)' }}
          className={'overflow-hidden small:rounded-[24px]'}
        >
          <CircleButton
            disabled={currentSlide === 0}
            onClick={slickPrev}
            className="absolute maxSmall:hidden  left-[52px] top-1/2 -translate-y-1/2 z-[1]"
          />
          <CircleButton
            disabled={data ? currentSlide === data.photos.length - 1 : true}
            onClick={slickNext}
            className="absolute maxSmall:hidden rotate-180 top-1/2 -translate-y-1/2 right-[52px] z-[1]"
          />
          <div className="w-fit absolute left-5 top-5 small:top-8 small:left-[52px] z-10">
            <div className="!min-h-[42px] !min-w-[42px]">
              <BackButton className="!h-[42px] !w-[42px]" />
            </div>
          </div>
          <div className="absolute z-[1] small:hidden right-5 top-5 small:top-5 small:right-[40px] flex">
            <div
              role="none"
              className={`overflow-hidden shadow-xl  flex  items-center h-[42px] w-[42px] p-3 justify-center  transition rounded-full cursor-pointer hover:!bg-lightGray 
                ${isPreviewProfile ? 'bg-orange' : 'bg-white'}`}
              onClick={() =>
                dispatch(
                  setModal({
                    currentModal: MODALS_TYPE.SHARE_SOCIAL_BOTTOMSHEET,
                  })
                )
              }
            >
              <IconShareBlack
                className={isPreviewProfile ? 'stroke-white' : 'stroke-black'}
              />
            </div>
          </div>

          <Slider
            className="-mx-3 cursor-pointer small:mb-[-8px] h-[450px] small:mx-0 max-h-[520px]"
            ref={slickRef}
            {...sliderSettings}
          >
            {data && data.photos?.length > 0 ? (
              data.photos.map((photo, index) => (
                <div className={'small:rounded-[24px]'} key={index}>
                  <ProfileSlideImage image={photo || ''} />
                </div>
              ))
            ) : (
              <>
                <ProfileSlide image={''} />
                <ProfileSlide image={''} />
              </>
            )}
          </Slider>

          <ul className="maxSmall:flex absolute bottom-[34px] left-1/2 -translate-x-1/2 hidden items-center justify-center gap-x-[8px]">
            {data &&
              data.photos?.map((_, index) => (
                <li
                  role="none"
                  key={index}
                  onClick={() => onClickDot(index)}
                  className={`w-2 h-2  cursor-pointer bg-white ${
                    currentSlide === index ? '' : 'opacity-50'
                  } rounded-full`}
                />
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
})
