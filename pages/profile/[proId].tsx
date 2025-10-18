import { AxiosError } from 'axios'
import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { refreshToken } from '@/api/auth/refreshToken'
import { ImgProUser } from '@/assets/images/images'
import { Distance } from '@/components/cardElements/Distance'
import { UserIcon } from '@/components/cardElements/UserIcon'
import { Button } from '@/components/common/buttons/Button'
import { SpinnerFullScreen } from '@/components/Loaders'
import { H16 } from '@/components/typography'
import { API_USER } from '@/core/consts/apiLinks'
import { locationDefaultHeaders, MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { useIsPreviewProfile } from '@/features/profile/hooks/useIsPreviewProfile'
import { Profile } from '@/features/profile/Profile'
import {
  IProfileAbout,
  IProfileReview,
  IProInfo,
  IRating,
  ITermsOfPayment,
} from '@/features/profile/profileType'
import {
  getAboutPro,
  getProfilePro,
  getRatingPro,
  getReviewsPro,
  getSimilarProByIdThunk,
  getTermsOfPaymentPro,
} from '@/features/profile/store/profileRequests'
import {
  profileSelector,
  profileServicesSelector,
} from '@/features/profile/store/profileSelectors'
import {
  REVIEWS_PER_PAGE,
  setProfileSlice,
} from '@/features/profile/store/profileSlice'
import { getCookieLocation } from '@/features/search/helpers/localLocation'
import { IUserInfo } from '@/features/userProfile/types'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { universalInstance } from '@/store/instance'
import { meSelector } from '@/store/me/meSelector'

const QuestionModal = dynamic<any>(
  () => import('@/features/profile/components/QuestionModal')
)
const ShareSocialBottomeSheet = dynamic(
  () => import('@/features/profile/components/topBlock/ShareSocialBottomeSheet')
)

interface Props {
  iProInfo: IProInfo
  rating: IRating
  reviews: { reviews: IProfileReview[]; total: number }
  about: IProfileAbout
  termsOfPayment: ITermsOfPayment
}

const ProtectLayout = (props: Props) => {
  const session = useSession()
  const router = useRouter()
  const proId = router.query.proId as string
  const me = useAppSelector(meSelector)
  const meStatus = useAppSelector((state) => state.me.meStatus)

  useEffect(() => {
    if (session.data?.user.role === 'PRO' && !meStatus) {
      if (![me.pro?.id, me.pro?.slug].includes(String(proId) || '')) {
        router.push(ROUTES.home)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.pro?.id, me.pro?.slug, meStatus, proId, session.data?.user.role])

  if (session.data?.user.role === 'PRO' && meStatus) {
    return <SpinnerFullScreen />
  }

  return <ProfilePage {...props} />
}

const ProfilePage = ({
  iProInfo,
  rating,
  reviews,
  about,
  termsOfPayment,
}: Props) => {
  // const router = useRouter()

  // const proId = router.query.proId as string
  const proId = iProInfo.id

  const dispatch = useAppDispatch()
  const { data } = useAppSelector(profileServicesSelector)
  const { data: profileData, status } = useSelector(profileSelector)
  const { distance } = profileData
  const { country } = useAppSelector(meSelector)
  const isMyProfile = useIsPreviewProfile()
  const currentModal = useAppSelector((state) => state.modals.currentModal)

  const [listedServices, setListedServices] = useState(0)

  useEffect(() => {
    if (data) {
      setListedServices(
        data.reduce((acc, item) => acc + item.categories.length, 0)
      )
    }
  }, [data])

  useEffect(() => {
    dispatch(getSimilarProByIdThunk(proId)).catch((err) => {
      //eslint-disable-next-line
      console.log('effect error #profile:', err)
    })
  }, [dispatch, proId])

  useEffect(() => {
    dispatch(
      setProfileSlice({
        rating: { data: rating, status: false },
        reviews: {
          data: reviews?.reviews,
          status: false,
          page: 1,
          limit: REVIEWS_PER_PAGE,
          total: reviews?.total,
        },
        about: { data: about, status: false },
        iProInfo: { data: iProInfo, status: false },
        termsOfPayment: { data: termsOfPayment, status: false },
      })
    )
  }, [
    about,
    dispatch,
    iProInfo,
    rating,
    reviews?.reviews,
    reviews?.total,
    termsOfPayment,
  ])

  return (
    <>
      <Profile proId={proId} distance={distance} />
      {currentModal === MODALS_TYPE.ASK_A_QUESTION && <QuestionModal />}
      {currentModal === MODALS_TYPE.SHARE_SOCIAL_BOTTOMSHEET && (
        <ShareSocialBottomeSheet />
      )}

      <div className="fixed bottom-0 left-0 w-full py-2 bg-white px-[132px] items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] hidden laptop:flex">
        <div className="container flex flex-row justify-between items-center">
          <div className="flex flex-row justify-between items-center space-x-4">
            {iProInfo.iconUrl && iProInfo.iconUrl !== 'https://string' ? (
              <UserIcon size={'44'} iconUrl={iProInfo.iconUrl} />
            ) : (
              <div
                className={
                  'p-1.5 bg-[#EDDFFF] h-11 w-11 rounded-full overflow-hidden'
                }
              >
                <Image alt={'alt pro icon'} src={ImgProUser} />
              </div>
            )}
            <div className="flex flex-col justify-between">
              <H16 className="text-black leading-[24px] !font-normal">
                {iProInfo.name || ''}
              </H16>
              <Distance
                status={status}
                distance={distance}
                country={country}
                distanceStyle="text-[#808080]"
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center space-x-8">
            <H16 className="text-[#95A0AD]">
              {listedServices} {listedServices === 1 ? 'service' : 'services'}{' '}
              available
            </H16>

            <Link href={ROUTES.booking(proId)}>
              <Button buttonType="orange" size="44" disabled={isMyProfile}>
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = String(ctx.query?.proId || '')

  const location = getCookieLocation(ctx)
  const headersParams = location.lng
    ? {
        [locationDefaultHeaders.lat]: location.lat,
        [locationDefaultHeaders.lng]: location.lng,
      }
    : {}

  const token = await getToken(ctx)
  let newSessionToken: Awaited<ReturnType<typeof refreshToken>> | undefined =
    undefined

  // check we have token and accessToken expire time less than now
  // if true then request new accessToken
  if (token && Date.now() >= token.accessTokenExp * 1000) {
    newSessionToken = await refreshToken(
      {
        id: token.refreshTokenId,
        token: token.refreshToken,
      },
      token.accessToken
    )
  }

  const params = {
    token: newSessionToken
      ? newSessionToken.accessToken
      : token?.accessToken || '',
    headersParams,
    id,
  }

  const instance = await universalInstance(ctx)

  try {
    if (token?.role === 'PRO') {
      const res = await instance.get<IUserInfo>(API_USER.me)

      if ((res.data?.pro?.slug || res.data.pro?.id) !== id) {
        return {
          redirect: {
            destination: ROUTES.myProfile,
            permanent: false,
          },
        }
      }
    }
  } catch (e) {
    //
  }

  //
  try {
    const iProInfo = await getProfilePro(params)

    // if client is coming with real ID of Pro, then redirect him to Pro's directUrl. Because real ID is as seen as a directUrl and marketplace will not be collected for it
    // for edge case: if directLink does not exist, use real ID
    if (id === iProInfo.id && iProInfo.directLink) {
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_SITE_URL}/${ROUTES.profile(
            iProInfo.directLink
          )}`,
        },
      }
    }

    params.id = iProInfo.id
    const rating = await getRatingPro(params)
    const reviews = await getReviewsPro({
      ...params,
      page: 1,
      limit: REVIEWS_PER_PAGE,
    })

    const termsOfPayment = await getTermsOfPaymentPro(params)

    const about = await getAboutPro(params)

    if (!iProInfo.id) {
      //eslint-disable-next-line
      console.log('line1 error #profile:', iProInfo.id)
    }

    return {
      notFound: !iProInfo.id,
      props: {
        iProInfo,
        rating,
        reviews,
        about,
        location,
        termsOfPayment,
      },
    }
  } catch (e) {
    const error = e as AxiosError

    //eslint-disable-next-line
    console.log('error #profile:', error)

    if (error.response?.status == 404) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      }
    }
    return {
      notFound: true,
      props: {},
    }
  }
}
export default ProtectLayout
