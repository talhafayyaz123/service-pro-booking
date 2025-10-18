import '@/assets/fonts/custom-website/custom-website-fonts.css'
import '@/assets/fonts/fonts.css'
import '@/styles/biling-information.css'
import '@/styles/bottom-sheet.css'
import '@/styles/globals.css'
import '@/styles/slickSlider.css'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'

import * as Sentry from '@sentry/nextjs'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { SessionProvider } from 'next-auth/react'
import { DefaultSeo } from 'next-seo'
import useTranslation from 'next-translate/useTranslation'
import NextNProgress from 'nextjs-progressbar'
import { ReactElement, ReactNode, useLayoutEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useStore } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'

import { ModalsContainer } from '@/components/ModalsContainer'
import { ErrorCrash } from '@/features/errors/ErrorCrash'
import { MeContainer } from '@/hooks/MeContainer'
import { LayoutHelper } from '@/layouts/LayoutHelper'
import { ProtectNoNameUserLayout } from '@/layouts/ProtectNoNameUser'
import { WebSocketLayout } from '@/layouts/WebSocketLayout'
import { wrapper } from '@/store/rootStore'
import { QueryClientWrapper } from '@/wrapper/query-client-wrapper'

const IntercomProviderCustom = dynamic(
  () => import('features/intercomWidget/IntercomProviderCustom'),
  { ssr: false }
)
const GoogleCaptchaProvider = dynamic(
  () => import('features/googleCaptchaProvider/GoogleCaptchaProvider'),
  { ssr: false }
)
// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const router = useRouter()
  const { t } = useTranslation('common')

  useLayoutEffect(() => {
    const doc = document.documentElement

    const handleResize = () => {
      const viewportHeight = window.visualViewport.height

      // Detect if keyboard is open by comparing visualViewport height and window.innerHeight
      if (viewportHeight < 600) {
        // Remove --app-height when keyboard is open
        doc.style.removeProperty('--app-height')
        doc.style.setProperty('--overflow', `auto`)
      } else {
        // Restore --app-height when keyboard is closed
        doc.style.setProperty('--app-height', `${viewportHeight}px`)
        // doc.style.setProperty('--overflow', `hidden`)
      }
    }

    handleResize()
    window.visualViewport.addEventListener('resize', handleResize)

    return () => {
      window.visualViewport.removeEventListener('resize', handleResize)
    }
  }, [])
  const getLayout = Component.getLayout ?? ((page) => page)
  const store = useStore() as any
  return (
    <ErrorBoundary
      onError={(error) => {
        // Log response error to Sentry
        Sentry.captureException(error)
      }}
      fallback={<ErrorCrash />}
    >
      <Head>
        <DefaultSeo
          title={t('default_seo_title')}
          titleTemplate="%s | Readyhubb"
          description={t('default_seo_description')}
          openGraph={{
            type: 'website',
            url: 'https://readyhubb.com' + router.asPath,
            images: [
              {
                url: '/assets/main_logo.svg',
                alt: t('default_seo_title'),
              },
            ],
          }}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <NextNProgress color="#F36A46" options={{ showSpinner: false }} />
      <PersistGate loading={null} persistor={store.__persisitor}>
        <SessionProvider session={pageProps?.session} refetchInterval={30}>
          <QueryClientWrapper>
            <IntercomProviderCustom>
              <GoogleCaptchaProvider>
                <LayoutHelper>
                  <ProtectNoNameUserLayout />
                  <>
                    <WebSocketLayout />
                    {getLayout(<Component {...pageProps} />)}
                    <ModalsContainer />
                    <MeContainer pathname={router.pathname} />
                  </>
                </LayoutHelper>
              </GoogleCaptchaProvider>
            </IntercomProviderCustom>
          </QueryClientWrapper>
        </SessionProvider>
      </PersistGate>
    </ErrorBoundary>
  )
}

export default wrapper.withRedux(App)
