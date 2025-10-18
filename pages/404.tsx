import { NotFound } from '@/features/errors/NotFound'
import BaseLayout from '@/layouts/BaseLayout'

const Error404 = () => {
  return (
    <BaseLayout seoTitle={'Not Found'} seoDescription={''}>
      <NotFound title={'No Items Found!'} />
    </BaseLayout>
  )
}

export default Error404
