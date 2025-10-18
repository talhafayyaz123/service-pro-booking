import { GetServerSideProps } from 'next'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import useTranslation from 'next-translate/useTranslation'
import React, { ReactNode, useMemo } from 'react'

import { MainLayoutWrapper } from '@/components/MainLayoutWrapper'
import { H80 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import BaseLayout from '@/layouts/BaseLayout'
import { TRole } from '@/types/common'

interface Props {
  isMobile: boolean
  forRole?: TRole
}

const TermsAndConditionsPro = dynamic(
  () => import('components/TermsAndConditionsPro')
)

const TermsAndConditionsClient = dynamic(
  () => import('components/TermsAndConditionsClient')
)

const TermsAndConditionsPage = ({ forRole, isMobile }: Props) => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)
  const session = useSession()

  const role =
    useMemo(() => {
      if (session.data?.user) {
        return session?.data?.user?.role
      } else {
        return forRole
      }
    }, [forRole, session.data?.user]) || 'PRO'

  const content: Record<typeof role, ReactNode> = {
    PRO: <TermsAndConditionsPro />,
    CLIENT: <TermsAndConditionsClient />,
  }

  return (
    <BaseLayout
      seoTitle={t('seo.titles.terms_and_conditions')}
      seoDescription={t('seo.description')}
    >
      <MainLayoutWrapper isMobile={isMobile}>
        {!isMobile ? (
          <div className="bg-violet">
            <div className="container text-center">
              <H80 className="maxTablet:py-20 py-[120px] maxTablet:text-[32px]">
                Terms of Service
              </H80>
            </div>
          </div>
        ) : null}

        <div
          className={`container ${isMobile ? 'my-6' : 'my-12'} overflow-scroll`}
        >
          {content[role]}
        </div>
      </MainLayoutWrapper>
    </BaseLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const query = ctx.query
  const isMobile = ctx.query.mobile === 'true'

  return {
    props: {
      forRole: query?.forRole || null,
      isMobile,
    },
  }
}

export default TermsAndConditionsPage
