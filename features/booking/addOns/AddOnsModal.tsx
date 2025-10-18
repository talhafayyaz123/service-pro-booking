import { useState } from 'react'

import { Button } from '@/components/common/buttons/Button'
import { Modal } from '@/components/modals/Modal'
import { H14, H16, H24 } from '@/components/typography'
import { AddonCard } from '@/features/booking/addOns/AddonCard'
import {
  addedAddonsIdsSelector,
  allAddonsSelector,
} from '@/features/booking/store/bookingSelectors'
import { selectAddon } from '@/features/booking/store/bookingStore'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

export const AddOnsModal = () => {
  const allAddons = useAppSelector(allAddonsSelector)
  const allAddedAddons = useAppSelector(addedAddonsIdsSelector)
  const [selected, setSelected] = useState(allAddedAddons)
  const dispatch = useAppDispatch()

  const handleClick = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((el) => el !== id) : [...prev, id]
    )
  }

  const handleApply = () => {
    dispatch(selectAddon(selected))
    dispatch(setModal({}))
  }

  const onCloseModal = () => dispatch(setModal({}))
  return (
    <Modal
      className={'!p-0 rounded-3xl text-start'}
      titleClassName={' pr-10 py-6 shadow-xl'}
      title={<H24 className={'block mr-auto'}>Select Add Ons</H24>}
      maxWidth={600}
      onClose={onCloseModal}
      isOpen={true}
    >
      <div className={'tablet:m-7 text-start'}>
        <H14 color={'text-black'} className={' mx-4 pt-4 block tablet:m-0'}>
          Select Add-Ons
        </H14>
        <div
          className={
            'grid tablet:grid-cols-2 gap-4 maxTablet:max-h-[400px] max-h-[700px] py-3 px-4 overflow-auto  mt-3'
          }
        >
          {allAddons.map((el) => (
            <AddonCard
              onClick={(id) => handleClick(id)}
              isActive={selected.includes(el.id)}
              key={el.id}
              {...el}
            />
          ))}
        </div>
      </div>
      <div className={'flex items-center justify-between px-10 py-5'}>
        <H16>{selected.length} Add-Ons Selected</H16>
        <div className={'w-[123px]'}>
          <Button onClick={handleApply} className={'w-full'} buttonType={'3d'}>
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}
