import Image from 'next/image'

import { ImgFavorite } from '@/assets/images/images'
import { ITab, Stepper } from '@/components/common/steppers/Stepper'
import { H18, H80 } from '@/components/typography'
import { Professionals } from '@/features/favorites/tabs/Professionals'

export const Favorites = () => {
  const tabs: ITab[] = [
    {
      label: 'Professionals',
      id: 'professionals',
      content: <Professionals />,
    },
  ]

  return (
    <>
      <div className={'bg-violet '}>
        <div
          className={
            'container flex justify-between maxTablet:justify-center maxTablet:py-10'
          }
        >
          <div className={'flex flex-col justify-center  '}>
            <H80>Favorites</H80>
            <H18 color={'text-gray'} className={'max-w-[400px] mt-3'}>
              Here you can find professionals you follow and keep up with your
              favourite inspiration posts
            </H18>
          </div>
          <div className={'flex laptop:mt-[-30px] maxTablet:hidden'}>
            <Image
              alt={'image'}
              priority={false}
              height={457}
              width={697}
              src={ImgFavorite.src}
            />
          </div>{' '}
        </div>
      </div>
      <div className="container tablet:mt-[60px] my-10 tablet:mb-[120px]">
        <Stepper
          // contentTop={<ProfileInfoMobile />}
          // className={'small:hidden relative'}
          currentTab={'professionals'}
          // stepsClassName={'mt-6 justify-around'}
          fullRender={false}
          wrapperClassName={'mb-6'}
          // labelClassName={'!text-14 !leading-[18px] mb-2'}
          tabs={tabs}
        />
      </div>
    </>
  )
}
