import * as Sentry from '@sentry/nextjs'
import type { NextPageContext } from 'next'

import { ErrorCrash } from '@/features/errors/ErrorCrash'
import BaseLayout from '@/layouts/BaseLayout'

const Error = () => {
  return (
    <BaseLayout seoTitle="Error" seoDescription={''}>
      <div className="hidden error-page" />
      <ErrorCrash />
    </BaseLayout>
  )
}

Error.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData)
}

export default Error
