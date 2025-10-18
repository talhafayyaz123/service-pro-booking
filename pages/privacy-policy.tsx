import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

import { MainLayoutWrapper } from '@/components/MainLayoutWrapper'
import { H80 } from '@/components/typography'
import BaseLayout from '@/layouts/BaseLayout'
export const PrivacyPolicyLazy = dynamic(
  () => import('@/features/userProfile/components/PrivacyPolicy')
)
interface Props {
  isMobile: boolean
}

const PrivacyPolicyPage = ({ isMobile }: Props) => {
  return (
    <BaseLayout seoTitle="Privacy policy" seoDescription="description">
      <MainLayoutWrapper isMobile={isMobile}>
        {!isMobile ? (
          <div className="bg-violet">
            <div className="container text-center">
              <H80
                className={'maxTablet:py-20 py-[120px] maxTablet:text-[32px]'}
              >
                Privacy Policy
              </H80>
            </div>
          </div>
        ) : null}
        <div className={`container ${isMobile ? 'my-6' : 'my-12'}`}>
          <PrivacyPolicyLazy />
        </div>
      </MainLayoutWrapper>
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const isMobile = ctx.query.mobile === 'true'

  return {
    props: {
      isMobile,
    },
  }
}

export default PrivacyPolicyPage
