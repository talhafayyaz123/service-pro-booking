import { BackButton } from '@/components/common/buttons/BackButton'
import { LogoButton } from '@/components/common/buttons/LogoButton'
import { NotFoundPic } from '@/components/common/NotFoundPic'

export const NotFound = (props: { title: string; subtitle?: string }) => {
  return (
    <div className={'h-screen overflow-auto'}>
      <header
        className={'grid grid-cols-3 px-9 tablet:px-20 py-4 shadow-xl bg-white'}
      >
        <div>
          <BackButton className={'w-fit'} />
        </div>
        <LogoButton />
        <div />
      </header>
      <NotFoundPic {...props} />
    </div>
  )
}
