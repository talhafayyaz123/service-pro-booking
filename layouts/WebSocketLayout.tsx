import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { create } from 'zustand'

import { MODALS_TYPE } from '@/core/consts/common'
import { useAppDispatch, useAppSelector } from '@/hooks/hooks'
import { setModal } from '@/store/modals/modalsSlice'

const getsocketUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  return (baseUrl || '')
    .replace('https://', 'wss://')
    .replace('http://', 'ws://')
}

export interface SocketResponse {
  type: 'SUBSCRIPTION_INVOICE' | 'PLANNED' | 'BOOKING_STATUS'
  data: Partial<{
    status: 'paid'
    stripeSubId: string
    subscriptionId: string
    bookingId?: string
    bookingStatus?: string
    bookingPaymentStatus?: string
  }>
}
interface SocketState {
  response: Partial<SocketResponse>
  setResponse: (response: Partial<SocketResponse>) => void
}

export const useSocketStore = create<SocketState>((set) => ({
  response: {},
  setResponse: (response) => set((state) => ({ ...state, response })),
}))

export const WebSocketLayout = () => {
  const user = useSession()
  const token = user.data?.user.accessToken
  const currentModal = useAppSelector((state) => state.modals.currentModal)
  const socketStore = useSocketStore((state) => state)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const ws = new WebSocket(getsocketUrl())
    if (user.data?.user.role !== 'PRO') {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'CONNECT',
            token: token,
          })
        )

        ws.onmessage = (e) => {
          const resp = JSON.parse(e.data) as SocketResponse
          if (resp.type === 'BOOKING_STATUS') {
            socketStore.setResponse(resp)
          }
        }
      }
    } else {
      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: 'CONNECT',
            token: token,
          })
        )
        ws.onmessage = (e) => {
          if (currentModal !== MODALS_TYPE.UPGRADE_SUBSCRIPTION_MODAL) {
            dispatch(
              setModal({ currentModal: MODALS_TYPE.UPGRADE_SUBSCRIPTION_MODAL })
            )
          }
          const resp = JSON.parse(e.data) as SocketResponse

          if (resp.type === 'SUBSCRIPTION_INVOICE') {
            socketStore.setResponse(resp)
          }
        }
      }
    }

    return () => {
      ws.close()
    }
  }, [currentModal, dispatch, socketStore, token, user.data?.user.role])

  return null
}
