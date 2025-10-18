import { AxiosError } from 'axios'

import { API_USER } from '@/core/consts/apiLinks'
import { ISubscriptionsInfo } from '@/features/userProfile/types'
import { universalInstance } from '@/store/instance'

interface Body {
  amount: number
  period: 'month' | 'year'
  sourceId: string
  cardId?: string
}

export const upgradeSubscription = async (body: Body) => {
  const instance = await universalInstance()

  try {
    const { data } = await instance.post<ISubscriptionsInfo>(
      API_USER.unsubscribe,
      body
    )

    return data
  } catch (err) {
    return Promise.reject(err as AxiosError)
  }
}
