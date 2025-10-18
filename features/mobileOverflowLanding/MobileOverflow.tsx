import Image from 'next/image'
import { memo } from 'react'

import { IconMainLogo } from '@/assets/icons/icons'
import {
  ImgPhoneOverflowScreen,
  ImgTwoPhones,
  ImgYellowIphone,
} from '@/assets/images/images'
import { ApplePayLink } from '@/components/common/ApplePayLink'
import { CloseButton } from '@/components/common/buttons/CloseButton'
import { GooglePlayLink } from '@/components/common/GooglePlayLink'
import { H16, H18, H38, H42 } from '@/components/typography'

const MobileOverflow = memo(({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <div className="h-[100dvh] relative mb-20 overflow-y-auto">
        <div className="bg-violet absolute h-[629px] w-full small:pt-[56px] small:pb-[62px] pt-6 flex flex-col items-center justify-center pb-7 small:px-0 px-6" />
        <div className="relative px-6 pt-8 text-center">
          <div className="grid grid-cols-3">
            <div />
            <div className="flex items-center justify-center gap-3">
              <IconMainLogo className="flex-shrink-0" />
              <H18 className="!font-bold maxTablet:text-16 mb-[-3px]">
                READYHUBB
              </H18>
            </div>
          </div>
          <H42 className="mt-6 !font-bold">
            Download the <span className="text-orange">Readyhubb</span> app
          </H42>
          <H18 color="text-gray" className="mt-3">
            Discover and book top rated services near you!
          </H18>
          <Apps className="mt-6" />
          <div className="mx-auto mt-10">
            <Image
              alt="phone"
              priority={false}
              width={319}
              height={634}
              src={ImgPhoneOverflowScreen.src}
            />
          </div>
          <div className={'text-start mt-20'}>
            <H16 color={'text-orange'} className={'!font-bold'}>
              For Clients
            </H16>
            <H38 className={'mt-2'}>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              "Instantly book services with{' '}
              <span className={'text-orange'}>confidence</span>
            </H38>
            <H18 color={'text-gray'} className={'mt-3'}>
              Download our mobile app and gain access to thousands of freelance
              professionals near you and virtually. Schedule appointments with
              ease, make secure payments and keep up with your fave
              professionals.
            </H18>
          </div>
          <div className="mt-8 -mx-6">
            <div className={'relative flex items-center justify-end '}>
              <div className="bg-yellow w-full opacity-40 largeDesktop:block  h-[326px] mr-[44px]  absolute  rounded-r-[24px]" />
              <Image
                priority={false}
                width={375}
                height={383}
                src={ImgYellowIphone.src}
                alt=""
              />
            </div>
          </div>
          <div className={` mt-20 relative mx-[-24px] text-start`}>
            <div
              className={
                'bg-pink absolute  h-[calc(100%-50px)] z-[0] mb-[-50px]  w-full  opacity-40'
              }
            />
            <div className={'px-6 relative pt-[60px]'}>
              <H16 color={'text-orange'} className={'!font-bold'}>
                For Pros
              </H16>
              <H38 className={'mt-2'}>
                Sell your services online as a{' '}
                <span className={'text-orange'}>Pro</span>
              </H38>
              <H18 color={'text-gray'} className={'mt-3'}>
                List your business on Readyhubb to get discovered by new
                clients. Access marketing, messaging and payment tools on any
                device.
              </H18>
              <div className={'mx-auto w-fit'}>
                <Image
                  height={330}
                  width={319}
                  src={ImgTwoPhones.src}
                  alt={''}
                />
              </div>
            </div>
          </div>{' '}
          <H38 className={'!mt-20 text-start'}>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            We're creating better booking{' '}
            <span className={'text-orange'}>experiences!</span>
          </H38>
          <H18 color={'text-gray'} className={'mt-4 text-start'}>
            Try Readyhubb for free!
          </H18>
          <Apps className={'mt-4 mb-8'} />
        </div>
      </div>

      <div className="absolute top-6 right-6 flex justify-end">
        <CloseButton onClick={onClose} />
      </div>
    </>
  )
})

const Apps = ({ className }: { className?: string }) => {
  return (
    <div className={`flex justify-center gap-1.5  ${className}`}>
      <ApplePayLink type={'black'} />
      <GooglePlayLink />
    </div>
  )
}
export default MobileOverflow
