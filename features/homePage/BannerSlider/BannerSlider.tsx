import Image from 'next/image'
import { useRouter } from 'next/router'
import React from 'react'
import Slider from 'react-slick'

import {
  ImgHomepageBanner1,
  ImgHomepageBanner2,
  ImgHomepageBanner3,
  ImgMobileBanner1,
  ImgMobileBanner2,
  ImgMobileBanner3,
} from '@/assets/images/images'
import { Button } from '@/components/common/buttons/Button'
import { ROUTES } from '@/core/consts/routes'
import { getQueriesForSearchRedirect } from '@/features/search/helpers/localLocation'
import { useStoreLinks } from '@/hooks/useStoreLinks'

import styles from './bannerSlider.module.css'

const BannerSlider = () => {
  const { handleAppStoreClick, handlePlayStoreClick } = useStoreLinks()

  const settings = {
    dots: true,
    infinite: true,
    speed: 800,
    cssEase: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    useCSS: true,
    useTransform: true,
    waitForAnimate: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    dotsClass: 'slick-dots',
    responsive: [
      {
        breakpoint: 9999,
        settings: {
          slidesToShow: 1.65,
          centerMode: true,
          centerPadding: '10%',
          swipeToSlide: false,
          snapToSlide: true,
          edgeFriction: 0.15,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '5%',
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '5%',
          swipeToSlide: true,
        },
      },
    ],
  }

  const query = getQueriesForSearchRedirect()
  const router = useRouter()

  const handleBookNow = () => {
    router.push({
      pathname: ROUTES.search,
      query: { ...query },
    })
  }

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.bannerWrapper}>
        <Slider {...settings} className={styles.sliderContainer}>
          {/* First slide with single button */}
          <div className={styles.slideItem}>
            <div className={styles.bannerImage}>
              <div className="hidden tablet:block">
                <Image
                  src={ImgHomepageBanner3}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
              <div className="block tablet:hidden">
                <Image
                  src={ImgMobileBanner3}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
            </div>
            <Button className={styles.singleButton} onClick={handleBookNow} />
          </div>

          {/* Second slide with single button */}
          <div className={styles.slideItem}>
            <div className={styles.bannerImage}>
              <div className="hidden tablet:block">
                <Image
                  src={ImgHomepageBanner1}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
              <div className="block tablet:hidden">
                <Image
                  src={ImgMobileBanner1}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
            </div>
          </div>

          {/* Third slide with double buttons */}
          <div className={styles.slideItem}>
            <div className={styles.bannerImage}>
              <div className="hidden tablet:block">
                <Image
                  src={ImgHomepageBanner2}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
              <div className="block tablet:hidden">
                <Image
                  src={ImgMobileBanner2}
                  alt="banner"
                  className={styles.bannerImage}
                />
              </div>
            </div>
            <div className={styles.doubleButtonContainer}>
              <Button
                className={styles.doubleButton}
                onClick={handleAppStoreClick}
              />
              <Button
                className={styles.doubleButton}
                onClick={handlePlayStoreClick}
              />
            </div>
          </div>
        </Slider>
      </div>
    </div>
  )
}

export default BannerSlider
