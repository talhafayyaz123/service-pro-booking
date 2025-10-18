import { GetServerSideProps } from 'next'
import { getServerSideSitemapLegacy, ISitemapField } from 'next-sitemap'

import { getSearchResults } from '@/api/search/getSearchResults'
import { IProInfo } from '@/features/profile/profileType'
import { IResponseData } from '@/types/common'

const ServerSitemapPage = () => {
  return null
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const page = 1
  const limit = 40
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL

  let pros: IProInfo[] = []
  const response = await getSearchResults({
    headers: {},
    params: {
      page,
      limit,
    },
  })

  pros = pros.concat(response.data)

  const pagesCount = Math.ceil(response.total / limit)
  const requests: any[] = []

  if (pagesCount > 1) {
    for (let i = 2; i <= pagesCount; i++) {
      requests.push(
        getSearchResults({
          headers: {},
          params: {
            limit,
            page: i,
          },
        })
      )
    }

    const allPros = await Promise.all(requests)

    allPros.forEach((response: IResponseData<IProInfo>) => {
      pros = pros.concat(response.data)
    })
  }

  const siteMapItems: ISitemapField[] = []

  pros.forEach((pro) => {
    if (pro.slug && !pro.slug.includes('&')) {
      const item: any = {
        loc: `${SITE_URL}/profile/${pro.slug}`,
      }

      if (pro.photos?.length) {
        pro.photos.forEach((photo) => {
          if (photo) {
            if (item.images) {
              item.images.push({
                loc: { href: photo } as URL,
              })
            } else {
              item.images = [
                {
                  loc: { href: photo } as URL,
                },
              ]
            }
          }
        })
      }
      siteMapItems.push(item)
    }
  })

  return getServerSideSitemapLegacy(ctx, siteMapItems)
}

export default ServerSitemapPage
