import { useRouter } from 'next/router'
import { NextSeo } from 'next-seo'
import { OpenGraph, OpenGraphMedia } from 'next-seo/lib/types'
import { ReactNode } from 'react'

interface Props {
  seoTitle?: string
  seoDescription?: string
  seoTitleTemplate?: string
  seoOGType?: 'website' | 'article'
  seoOGDate?: string
  seoOGImage?: OpenGraphMedia
  children: ReactNode
}

const BaseLayout: React.FC<Props> = ({
  children,
  seoTitle,
  seoDescription,
  seoTitleTemplate,
  seoOGType = 'website',
  seoOGDate,
  seoOGImage,
}) => {
  const router = useRouter()

  const OGConfig: OpenGraph = {}

  OGConfig.type = seoOGType
  OGConfig.url = 'https://readyhubb.com' + router.asPath
  OGConfig.site_name = 'Readyhubb'
  OGConfig.title = seoTitle
  OGConfig.description = seoDescription

  if (seoOGDate) {
    OGConfig.article = {}
    OGConfig.article.publishedTime = seoOGDate
  }

  if (seoOGImage) {
    OGConfig.images = [seoOGImage]
  }
  return (
    <>
      <NextSeo
        title={seoTitle}
        description={seoDescription}
        titleTemplate={seoTitleTemplate || '%s | Readyhubb'}
        canonical={router.asPath}
        openGraph={OGConfig}
      />
      {children}
    </>
  )
}

export default BaseLayout
