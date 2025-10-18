import { CardWrapper } from '@/components/cardElements/CardWrapperR24'
import { H24 } from '@/components/typography'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { ProfileServiceInfo } from '@/features/profile/components/services/ProfileServiceInfo'
import {
  profileSelector,
  profileServicesSelector,
} from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'

const ServicesStep = () => {
  const { data } = useAppSelector(profileServicesSelector)
  const profile = useAppSelector(profileSelector)

  const currencySign = getCurrencySignByName(profile.data?.currency || '')

  return (
    <div className={'mt-3 flex flex-col gap-3'}>
      {data
        ?.filter((item) => item?.categories?.length > 0)
        ?.map(({ categories, ...el }, index) => (
          <CardWrapper key={el.id + index} className={'!shadow-none !pt-0'}>
            <div className={'mb-5'}>
              <H24 className={'pb-6'}> {el.name}</H24>
            </div>
            {categories.length === 0 ? (
              <div>so far there is nothing</div>
            ) : (
              categories.map((item, index, arr) => (
                <div
                  key={index}
                  className={`pb-4 border-b border-lightGray ${
                    index !== 0 ? ' mt-4' : ''
                  } ${index === arr.length - 1 ? 'border-b-0 pb-0' : ''}`}
                >
                  <ProfileServiceInfo
                    {...item}
                    isShowExtraTime={false}
                    currencySign={currencySign}
                    lines={2}
                    proId={profile.data.id}
                    buttonSize={'42'}
                    useProIdfromRouter
                  />
                </div>
              ))
            )}
          </CardWrapper>
        ))}
    </div>
  )
}
export default ServicesStep
