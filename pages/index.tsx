import jwt_decode from 'jwt-decode'
import type { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { getToken } from 'next-auth/jwt'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import { parseCookies } from 'nookies'
import { useEffect, useState } from 'react'

import Footer from '@/components/common/footer'
import { MainHeader } from '@/components/header/MainHeader'
import { useModalData } from '@/components/modals/Modal'
import { MODALS_TYPE } from '@/core/consts/common'
import { ROUTES } from '@/core/consts/routes'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import {
  isCloseOverflowScreen,
  isMobile,
  onCloseOverflowScreen,
} from '@/core/helpers/checkDevice'
// import { BNPL } from '@/features/homePage/BNPL'
import { BottomBlock } from '@/features/homePage/bottomBlock/BottomBlock'
import { ExploreBeauty } from '@/features/homePage/ExploreBeauty'
import { FeaturedPros } from '@/features/homePage/FeaturedPros/FeaturedPros'
import { LatestPros } from '@/features/homePage/LatestPros/LatestPros'
// import { FindYourInspiration } from '@/features/homePage/inspiration/FindYourInspiration'
import { RecentlyViewed } from '@/features/homePage/recentlyViewed/RecentlyViewed'
//import { TopRated } from '@/features/homePage/topRated/TopRated'
import { useAppDispatch } from '@/hooks/hooks'
import useMixpanel from '@/hooks/useMixpanel'
import { useRedirectProToUserPage } from '@/hooks/useRedirectProToUserPage'
import BaseLayout from '@/layouts/BaseLayout'
import { getMainOfServices } from '@/store/accountSetup/accountSetupRequests'
import { setCategories } from '@/store/accountSetup/accountSetupSlice'
import { homepageRequests } from '@/store/commonStor/homePage/homepageRequests'
import { setPageStatus } from '@/store/commonStor/homePage/homepageSlice'
import { ICategoriesResponse } from '@/types/categoriesTypes'

const MainPageCategories = dynamic(
  () => import('../features/homePage/MainPageCategories'),
  {
    ssr: false,
  }
)

const MobileOverflow = dynamic(
  () => import('@/features/mobileOverflowLanding/MobileOverflow')
)

const MainPageAllCategoriesModal = dynamic(
  () => import('@/components/modals/MainPageAllCategoriesModal')
)

const BannerSlider = dynamic(
  () => import('@/features/homePage/BannerSlider/BannerSlider')
)

const Home = ({
  isShowMobile,
  categories,
}: {
  isShowMobile: boolean
  categories: ICategoriesResponse
}) => {
  const { t } = useTranslation(TRANSLATE_KEYS.main_page)
  const { isOpen } = useModalData(MODALS_TYPE.MAIN_PAGE_ALL_CATEGORIES)
  const { identifyUser, trackPageViewEvent } = useMixpanel()
  const dispatch = useAppDispatch()
  const session = useSession()
  const [isRender, setRender] = useState(false)
  const [show, setShow] = useState(true)

  useEffect(() => {
    dispatch(setCategories(categories))
    setRender(true)
  }, [dispatch, categories])

  const isLogin = !!session.data?.user?.accessToken

  useEffect(() => {
    dispatch(homepageRequests(isLogin))
    return () => {
      dispatch(setPageStatus('loading'))
    }
  }, [dispatch, isLogin, session.data?.user.accessToken])

  async function getUserIdFromToken(token: string): Promise<string | null> {
    try {
      const decodedToken: any = jwt_decode(token)
      return decodedToken?.id ?? null
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  useEffect(() => {
    const fetchUserId = async () => {
      if (isLogin) {
        if (session.data?.user.accessToken) {
          const id = await getUserIdFromToken(session.data.user.accessToken)
          if (
            id !== null &&
            (typeof id === 'string' || typeof id === 'number')
          ) {
            identifyUser(id)
            trackPageViewEvent({ 'Page View': true })
          } else {
            console.warn('Invalid ID: ID should be a string or number')
          }
        }
      }
    }
    fetchUserId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useRedirectProToUserPage()

  return (
    <BaseLayout seoTitle={t('seo_title')} seoDescription={t('seo_description')}>
      {isShowMobile &&
      isRender &&
      isMobile() &&
      !isCloseOverflowScreen() &&
      show ? (
        <MobileOverflow
          onClose={() => {
            onCloseOverflowScreen()
            setShow(false)
          }}
        />
      ) : (
        <div
          id="app_layout"
          className="grid grid-rows-[72px_1fr_auto] tablet:grid-rows-[82px_1fr_auto]"
        >
          <MainHeader />

          <div id="scroll_section" className="flex-1 overflow-y-auto">
            <section className="flex flex-col">
              <ExploreBeauty />
              <MainPageCategories />
              <BannerSlider />
              {/* Removed based on client request */}
              {/* <div className="w-full px-4 tablet:px-0">
                <BNPL />
              </div> */}
              <div className="mt-4 tablet:mt-8">
                <FeaturedPros />
              </div>

              <div className="mt-4 tablet:mt-8">
                <LatestPros />
              </div>
              {/* Client request: RDHB-5454 */}
              {/* <FindYourInspiration /> */}
              {/* <TopRated /> */}
              <RecentlyViewed />
              <BottomBlock />
            </section>
            <Footer />
          </div>
          {isOpen && <MainPageAllCategoriesModal />}
        </div>
      )}
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getToken(ctx)
  const params = {
    token: session?.accessToken || '',
  }
  const role = session?.role

  if (role === 'PRO') {
    return {
      redirect: {
        destination: ROUTES.myProfile,
        permanent: true,
      },
    }
  }

  const mainOfServices = await getMainOfServices(params)
  const cookies = parseCookies(ctx)
  return {
    props: {
      isShowMobile: cookies.isShowOverflow !== 'true',
      categories: mainOfServices,
    },
  }
}

export default Home
