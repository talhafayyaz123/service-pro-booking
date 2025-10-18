import { ErrorCrash } from '@/features/errors/ErrorCrash'
import BaseLayout from '@/layouts/BaseLayout'

const Error500 = () => {
  return (
    <BaseLayout seoTitle="Error" seoDescription={''}>
      <div className="hidden 500-page" />
      <ErrorCrash />
    </BaseLayout>
  )
}

export default Error500
