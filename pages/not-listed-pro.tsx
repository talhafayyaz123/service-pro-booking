import { NotFound } from '@/features/errors/NotFound'
import BaseLayout from '@/layouts/BaseLayout'

const NotListedPro = () => {
  return (
    <BaseLayout seoTitle={'Not Found Pro'} seoDescription={''}>
      <NotFound
        title={'Oops Nothing to see here'}
        subtitle={'Please list your business to preview your profile'}
      />
    </BaseLayout>
  )
}

export default NotListedPro
