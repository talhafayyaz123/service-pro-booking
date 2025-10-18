import { useRouter } from 'next/router'

import { TemplateFormsView } from '@/features/customForm/BookingInfoCustomForm'
import { useGetCustomFormQuery } from '@/features/customForm/store/slice'
import { useGetInfoByExternalLinkQuery } from '@/features/paymentLink/store/paymentLinkApi'
import { useAppSelector } from '@/hooks/hooks'

export const CustomFormsWalkInBooking = () => {
  const router = useRouter()
  const id = router.query.bookingId as string

  const { data } = useGetInfoByExternalLinkQuery(id)
  const profile = useAppSelector((state) => state.profile.iProInfo.data)
  const booking = data?.booking
  const addedServices = booking?.services || []

  const { data: customForms, isFetching } = useGetCustomFormQuery(
    {
      proId: profile.id,
      serviceIds: addedServices.map((item) => item.proServiceId),
    },
    {
      skip: !profile.id,
    }
  )

  return (
    <div className="flex flex-col">
      <TemplateFormsView
        proInfo={profile}
        forms={customForms}
        isFetching={isFetching}
        className="mt-0 !rounded-20"
        isUsedInWalkInBooking
      />
    </div>
  )
}
