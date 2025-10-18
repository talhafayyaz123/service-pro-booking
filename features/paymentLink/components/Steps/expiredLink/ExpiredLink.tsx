import classNames from 'classnames'
import Image from 'next/image'
import Link from 'next/link'

import {
  ImgAppleStore,
  ImgGooglePlay,
  ImgWarning,
} from '@/assets/images/images'
import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { LogoButtonSubdomain } from '@/components/common/buttons/LogoButton'
import { H16, H18, H28 } from '@/components/typography'
import { APP_STORE_URL, GOOGLE_PLAY_URL } from '@/core/consts/common'
import { cn } from '@/core/helpers/cn'
import { points } from '@/features/paymentLink/components/Steps/successStep/components/PLSuccessScreen'

export const ExpiredLink = () => {
  return (
    <section className={' relative flex flex-col h-screen'}>
      <div
        className={classNames(
          'w-full absolute top-0 maxTablet:hidden  left-0 bg-violet z-[0] h-[346px]'
        )}
      />
      <header className="flex-none bg-white flex justify-center py-6 px-5 z-[2]">
        <LogoButtonSubdomain className="mr-[13px]" />
      </header>
      <div className={'z-[2] flex-grow overflow-auto '}>
        <div
          className={cn(
            'pt-4 max-w-[524px] w-full  mx-auto  bg-white z-[2] px-5 pb-6 maxTablet:h-full',
            'tablet:p-8 tablet:rounded-2xl tablet:shadow-warningCard   tablet:mt-[90px]'
          )}
        >
          <div className="ring-[3px] mx-auto ring-white shadow-xl size-[60px] flex justify-center items-center bg-[#FDEDED] rounded-full">
            <Image src={ImgWarning} alt="" width={24} height={24} />
          </div>
          <H28 className="font-bold leading-[34px] mt-7 mx-auto maxTablet:w-[220px] w-fit block text-center">
            Payment link has expired
          </H28>
          <CardWrapper className={'rounded-[12px] p-5 mt-8'}>
            <H18 className="!font-bold text-center mb-6">
              Download the <span className="text-orange">Readyhubb</span> app!
            </H18>
            <div className="flex flex-col gap-4">
              {points.map((item, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="shadow-roundPoint shrink-0 ring-[3px] ring-white rounded-full">
                    <div
                      className={cn(
                        'size-[42px] flex justify-center items-center rounded-full',
                        item.style
                      )}
                    >
                      {item.icon}
                    </div>
                  </div>
                  <H16>{item.text}</H16>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-1 mt-6 justify-center">
              <Link href={APP_STORE_URL} target={'_blank'}>
                <Image
                  src={ImgAppleStore}
                  width={149}
                  height={46}
                  alt="Download app from Apple store"
                />
              </Link>
              <Link href={GOOGLE_PLAY_URL} target={'_blank'}>
                <Image
                  src={ImgGooglePlay}
                  width={149}
                  height={46}
                  alt="Download app from Google play"
                />
              </Link>
            </div>
          </CardWrapper>
        </div>
      </div>
    </section>
  )
}
