import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { SideStepper } from '@/components/common/steppers/SideStepper'

export const LeftStepperSkeleton = () => {
  const skeletonTabs = [
    {
      label: <BaseSkeleton key={123} />,
      content: <ContentSkeleton key={'1'} />,
      id: '1',
    },
    {
      label: <BaseSkeleton key={1234} />,
      content: <ContentSkeleton key={'2'} />,
      id: '2',
    },
  ]
  return (
    <SideStepper
      scrollAfterClick
      stickyTop={'top-[60px]'}
      tabs={skeletonTabs}
    />
  )
}
const ContentSkeleton = () => {
  return (
    <div>
      <BaseSkeleton key={'1'} className={'!w-[150px]'} />
      <BaseSkeleton key={'2'} className={'w-[220px] mt-1'} />

      <div className={'mt-4  flex flex-col gap-[6px]'}>
        <BaseSkeleton key={'3'} className={'!w-full !h-[20px]'} />
        <BaseSkeleton key={'4'} className={'!w-full !h-[20px]'} />
        <BaseSkeleton key={'5'} className={'!w-full !h-[20px]'} />
      </div>
    </div>
  )
}
