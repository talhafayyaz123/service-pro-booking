import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

import { getValidSubdomain } from '@/core/helpers/getValidSubdomain'

// RegExp for public files
const PUBLIC_FILE = /\.(.*)$/ // Files

export async function middleware(req: NextRequest) {
  if (process.env.NEXT_PUBLIC_ENABLE_CUSTOM_PAGES === 'true') {
    /**
     * LOGIC FOR CUSTOM DOMAIN
     */

    // Clone the URL
    const url = req.nextUrl.clone()

    // Skip public files
    if (
      PUBLIC_FILE.test(url.pathname) ||
      url.pathname.includes('_next') ||
      url.pathname.includes('_log') ||
      url.pathname.includes('favicon')
    ) {
      return
    }

    // Extract query parameters
    const queryParams = url.searchParams
    queryParams.forEach((value, key) => {
      // eslint-disable-next-line no-console
      console.log(`Query parameter: ${key} = ${value}`)
    })

    const host = req.headers.get('host')
    const subdomain = getValidSubdomain(host)

    // Keep log for checking
    // eslint-disable-next-line no-console
    // console.log('>>> Middleware: [host] [subdomain] =>', host, subdomain);

    // Subdomain available, rewriting
    if (subdomain) {
      // Keep log for checking
      // eslint-disable-next-line no-console
      // console.log(
      //   `>>> Rewriting: ${url.pathname} to /${subdomain}${url.pathname}`
      // )
      if (subdomain === 'pay') {
        const query = url.pathname.split('/')[1] ?? ''
        url.pathname = `/payment-link/${query}`
      } else {
        url.pathname = `/${subdomain}${url.pathname}`
      }
    }

    return NextResponse.rewrite(url)
  }
}
