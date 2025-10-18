import { createAsyncThunk } from '@reduxjs/toolkit'

import { getUrlWithSearchParams } from '@/core/helpers/getUrlWithSearchParams'
import { ITemplateForm } from '@/features/booking/store/bookingStore'
import { universalInstance } from '@/store/instance'

export const getCustomFormsRequest = createAsyncThunk(
  'getCustomFormsRequest',
  async ({ proId, serviceIds }: { proId: string; serviceIds: string[] }) => {
    const instance = await universalInstance()
    const { data } = await instance.get<ITemplateForm[]>(
      getUrlWithSearchParams(`/v1/pros/${proId}/custom-forms`, {
        serviceIds,
      })
    )
    return data
  }
)
