import useTranslation from 'next-translate/useTranslation'
import React, {
  ReactNode,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import Slider, { Settings } from 'react-slick'

import { IconArrow } from '@/assets/icons/icons'
import { Button } from '@/components/common/buttons/Button'
import { BaseLink } from '@/components/common/links/BaseLink'
import { H48 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'

export interface IScrollBlockProps {
  content: ReactNode[]
  status: boolean
  dots?: boolean
  viewAllButton?: boolean
  viewAllClassName?: string
  skeletonNode: ReactNode
  title: ReactNode
  wrapperClassName?: string
  sliderHeaderClassName?: string
  href?: string
  id?: string
  className?: string
  propSettings?: Settings
  onViewAllClick?: () => void
}

const HorizontalSlider = ({
  status,
  skeletonNode,
  wrapperClassName,
  id = 'homepage_slider',
  className = 'container mx-auto',
  content,
  ...rest
}: IScrollBlockProps) => {
  const currentContent = status
    ? [...new Array(8)].map((_, index) => (
        <div className="mx-5 my-4" key={index}>
          {skeletonNode}
        </div>
      ))
    : content

  return (
    <div className={` ${wrapperClassName}`}>
      <div id={id} className={className}>
        <SlickSlider {...rest} content={currentContent} />
      </div>
    </div>
  )
}
const SlickSlider = ({
  content,
  title,
  viewAllButton = true,
  dots = true,
  viewAllClassName = '',
  propSettings,
  sliderHeaderClassName,
  onViewAllClick,
  href = '#',
}: Pick<
  IScrollBlockProps,
  | 'content'
  | 'title'
  | 'dots'
  | 'viewAllClassName'
  | 'viewAllButton'
  | 'sliderHeaderClassName'
  | 'href'
  | 'onViewAllClick'
> & { propSettings?: Settings }) => {
  const slickRef = useRef<Slider>(null)
  const { slickNext, slickPrev, settings, currentSlide, onClickDot } =
    useSlickSliderFunctional(slickRef)
  const { t: common } = useTranslation(TRANSLATE_KEYS.common)

  return (
    <>
      <div
        className={`container ml-0 p-0 flex justify-between items-start gap-[100px] small:items-center  ${sliderHeaderClassName}`}
      >
        {typeof title === 'string' ? (
          <H48 className="maxTablet:text-28 maxTablet:leading-[34px] !font-bold">
            {title}
          </H48>
        ) : (
          title
        )}
        <div className="flex mb-6 mr-6 desktop:mr-0">
          {viewAllButton && (
            <>
              <BaseLink
                href={href}
                type={onViewAllClick ? 'button' : 'link'}
                onClick={onViewAllClick}
                className="maxTablet:hidden"
                line={false}
              >
                <Button
                  className={`mr-[24px] ${viewAllClassName}`}
                  buttonType="3d"
                >
                  {common('buttons.view_all')}
                </Button>
              </BaseLink>
              <BaseLink
                line={false}
                type={onViewAllClick ? 'button' : 'link'}
                onClick={onViewAllClick}
                href={href}
                linkType="black"
                className={`maxTablet:block  hidden whitespace-nowrap leading-[22px] text-16 !font-normal ${viewAllClassName}`}
              >
                {common('buttons.view_all')}
              </BaseLink>
            </>
          )}

          {content.length > 2 && (
            <>
              <Button
                onClick={slickPrev}
                className={
                  'mr-[24px] maxTablet:hidden !rounded-full !w-[48px] !h-[48px]'
                }
                buttonType={'icon'}
              >
                <IconArrow className="w-5 h-5 stroke-black" />
              </Button>
              <Button
                onClick={slickNext}
                buttonType={'icon'}
                className={
                  'rotate-180 maxTablet:hidden !rounded-full !w-[48px] !h-[48px]'
                }
              >
                <IconArrow className="w-5 h-5 stroke-black" />
              </Button>
            </>
          )}
        </div>
      </div>
      <Slider
        className={'!cursor-pointers'}
        ref={slickRef}
        {...{ ...settings, ...propSettings }}
      >
        {content}
      </Slider>
      {dots && (
        <ul
          className={
            'maxTablet:flex hidden items-center justify-center mt-[24px] mb-[40px] gap-x-[8px]'
          }
        >
          {content.map((_, index) => (
            <li
              role={'none'}
              key={index}
              onClick={() => onClickDot(index)}
              className={`w-[8px] h-[8px] cursor-pointer  bg-orange ${
                currentSlide === index ? '' : 'opacity-50'
              } rounded-full`}
            />
          ))}
        </ul>
      )}
    </>
  )
}

export const useSlickSliderFunctional = (ref: RefObject<Slider>) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const settings: Settings = useMemo(
    () => ({
      dots: false,
      speed: 400,
      draggable: true,
      infinite: false,
      variableWidth: true,
      afterChange: (currentSlide: number) => {
        setCurrentSlide(currentSlide)
      },
      arrows: false,
    }),
    []
  )

  const onClickDot = useCallback(
    (index: number) => {
      ref?.current?.slickGoTo(index)
    },
    [ref]
  )

  const slickNext = useCallback(() => {
    ref?.current?.slickNext()
  }, [ref])

  const slickPrev = useCallback(() => {
    ref?.current?.slickPrev()
  }, [ref])
  return { slickNext, slickPrev, settings, currentSlide, onClickDot }
}

export default HorizontalSlider
