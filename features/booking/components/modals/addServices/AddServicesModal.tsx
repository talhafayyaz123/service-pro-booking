import { Button } from '@/components/common/buttons/Button'
import { BaseSkeleton } from '@/components/common/skeletons/BaseSkeleton'
import { Modal } from '@/components/modals/Modal'
import { H20, H24 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import {
  ServiceInfo,
  ServiceInfoSkeleton,
} from '@/features/booking/components/ServiceInfo'
import { useAddServices } from '@/features/booking/hooks/useAddServices'
import { bookingServicesSelector } from '@/features/booking/store/bookingSelectors'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'

export const AddServicesModal = () => {
  const {
    disabled,
    reference,
    referenceIds,
    isRefHasMobile,
    onSave,
    onClose,
    handleReferenceAdd,
    handleDeleteReference,
  } = useAddServices()
  const { currentModal } = useAppSelector(modalsSelector)
  const { isSmall, isTablet } = useMediaScreen()
  const profile = useAppSelector(profileSelector)

  const open =
    isSmall || isTablet ? false : currentModal === MODALS_TYPE.CHOOSE_SERVICE
  const { data, status } = useAppSelector(bookingServicesSelector)

  return (
    <Modal
      maxWidth={503}
      space="pt-7"
      title={<H24>Add a service</H24>}
      isOpen={open}
      titleClassName="border-b border-lightGray pb-6 flex mx-7"
      onClose={onClose}
    >
      <div>
        <div className="max-h-[550px] pt-6 overflow-auto pb-4">
          {status ? (
            <div className="mx-8">
              <BaseSkeleton className="w-[120px] mb-4" />
              <ServiceInfoSkeleton />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 mx-8 text-start">
              {data.map((item) => {
                const _services = item.services.filter((service) => {
                  if (!isRefHasMobile) {
                    if (reference.length) {
                      return !service.isMobile
                    } else {
                      return true
                    }
                  } else {
                    return service.isMobile
                  }
                })

                if (!_services.length) {
                  return null
                }
                return (
                  <div key={item.id}>
                    <H20>{`${item.category} (${item.services.length})`}</H20>
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {_services.map((service) => {
                        return (
                          <ServiceInfo
                            key={service.id}
                            {...service}
                            extraTime={0}
                            currencySign={getCurrencySignByName(
                              profile.data.currency || ''
                            )}
                            button={
                              referenceIds.includes(service?.id || '') ? (
                                <Button
                                  onClick={() =>
                                    handleDeleteReference(service.id)
                                  }
                                  size="42"
                                  buttonType="orange"
                                >
                                  Added
                                </Button>
                              ) : (
                                <Button
                                  onClick={() =>
                                    handleReferenceAdd({
                                      id: service.id as string,
                                      isMobile: service.isMobile || false,
                                    })
                                  }
                                  size="42"
                                  buttonType="lightMain"
                                >
                                  Add
                                </Button>
                              )
                            }
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="pt-4 pb-4 shadow-xl px-7">
          <Button
            onClick={onSave}
            disabled={disabled}
            buttonType="orange"
            className="w-full"
          >
            Save changes
          </Button>
        </div>
      </div>
    </Modal>
  )
}
