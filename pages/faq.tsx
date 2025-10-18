import useTranslation from 'next-translate/useTranslation'
import React from 'react'

import { H80 } from '@/components/typography'
import { TRANSLATE_KEYS } from '@/core/consts/translateKeys'
import { Faq } from '@/features/userProfile/components/accountSettings/steps/faq/Faq'
import BaseLayout from '@/layouts/BaseLayout'
import { MainLayout } from '@/layouts/MainLayout'

const FaqPage = () => {
  const { t } = useTranslation(TRANSLATE_KEYS.common)

  return (
    <BaseLayout seoTitle={'FAQ'} seoDescription={t('seo.description')}>
      <MainLayout id="app_layout">
        <div className="bg-violet">
          <div className="container text-center">
            <H80 className="maxTablet:py-20 py-[120px] maxTablet:text-[48px]">
              FAQ
            </H80>
          </div>
        </div>
        <div className="!max-w-[800px] w-full grid mx-auto mt-[60px] mb-20">
          <Faq />
        </div>
      </MainLayout>
    </BaseLayout>
  )
}

export default FaqPage
