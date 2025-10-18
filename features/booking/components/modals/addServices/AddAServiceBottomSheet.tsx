import 'react-spring-bottom-sheet/dist/style.css'

import { useMemo } from 'react'
import { BottomSheet } from 'react-spring-bottom-sheet'

import { Button } from '@/components/common/buttons/Button'
import { H16, H20 } from '@/components/typography'
import { MODALS_TYPE } from '@/core/consts/common'
import { getCurrencySignByName } from '@/core/helpers/getCurrencySignByName/getCurrencySignByName'
import { ServiceInfo } from '@/features/booking/components/ServiceInfo'
import { useAddServices } from '@/features/booking/hooks/useAddServices'
import { bookingServicesSelector } from '@/features/booking/store/bookingSelectors'
import { profileSelector } from '@/features/profile/store/profileSelectors'
import { useAppSelector } from '@/hooks/hooks'
import { useMediaScreen } from '@/hooks/useMediaScreen'
import { modalsSelector } from '@/store/modals/modalsSelectors'

export const AddAServiceBottomSheet = () => {
  const { currentModal } = useAppSelector(modalsSelector)
  const { data } = useAppSelector(bookingServicesSelector)
  const profile = useAppSelector(profileSelector)
  const { isSmall, isTablet } = useMediaScreen()
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

  const open = useMemo(
    () =>
      !isSmall && !isTablet
        ? false
        : currentModal === MODALS_TYPE.CHOOSE_SERVICE,
    [currentModal, isSmall, isTablet]
  )

  return (
    <BottomSheet
      open={open}
      skipInitialTransition
      blocking
      footer={
        <div>
          <Button
            onClick={onSave}
            disabled={disabled}
            buttonType="orange"
            className="w-full"
          >
            Save changes
          </Button>
        </div>
      }
      className={'absolute z-10'}
      onDismiss={onClose}
      snapPoints={({ maxHeight }) => maxHeight - 5}
      defaultSnap={({ maxHeight }) => maxHeight - 5}
      header={<H16 className={'!font-bold mt-2 mr-4'}>Add a service</H16>}
    >
      <div className="grid w-full grid-cols-1 gap-4 mt-6 text-start">
        {data.map((item, ind) => {
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
              <H20 className="px-5">{`${item.category} (${_services.length})`}</H20>
              <div>
                {_services.map((service) => {
                  return (
                    <ServiceInfo
                      currencySign={getCurrencySignByName(
                        profile.data.currency || ''
                      )}
                      showMoreClassName={'!w-full'}
                      className={`shadow-none rounded-none px-5 pt-3 pb-4 ${
                        ind < data.length - 1 ? 'border-b border-lightGray' : ''
                      }`}
                      key={service.id}
                      {...service}
                      extraTime={0}
                      button={
                        referenceIds.includes(service?.id || '') ? (
                          <Button
                            onClick={() => handleDeleteReference(service.id)}
                            size="42"
                            buttonType="orange"
                          >
                            Added
                          </Button>
                        ) : (
                          <Button
                            onClick={() =>
                              handleReferenceAdd({
                                id: (service.id as string) || '',
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
    </BottomSheet>
  )
}
