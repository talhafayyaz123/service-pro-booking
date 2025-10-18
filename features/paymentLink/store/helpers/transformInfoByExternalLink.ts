import { initialStore } from '@/features/paymentLink/store/constatnts'
import {
  loadFromLocalStorage,
  usePaymentLinkStore,
} from '@/features/paymentLink/store/store'
import {
  IExternalInfo,
  TransformPLResponse,
} from '@/features/paymentLink/store/types'

export const transformInfoByExternalLink = (response: IExternalInfo) => {
  const travelFee = response?.booking?.travelFee ?? 0
  const taxAmount = response?.booking?.taxAmount ?? response?.quickpay?.tax
  const taxPercent =
    response?.booking?.pro?.taxPercent ?? response?.quickpay?.pro?.taxPercent

  const totalAmount =
    (response?.booking?.services ?? []).reduce(
      (acc, item) => acc + item.price,
      0
    ) +
    (response?.booking?.addons ?? []).reduce(
      (acc, item) => acc + item.price,
      0
    ) +
    (response?.quickpay?.amount ?? 0)

  const totalPrice =
    response?.type === 'QUICKPAY'
      ? response?.quickpay?.amount +
        (response?.booking?.services ?? []).reduce(
          (acc, item) => acc + item.price,
          0
        ) +
        (response?.booking?.addons ?? []).reduce(
          (acc, item) => acc + item.price,
          0
        ) +
        travelFee +
        taxAmount
      : (response?.booking?.services ?? []).reduce(
          (acc, item) => acc + item.price,
          0
        ) +
        (response?.booking?.addons ?? []).reduce(
          (acc, item) => acc + item.price,
          0
        ) +
        travelFee +
        taxAmount

  const tipType = response?.tipType ?? response?.quickpay?.tipType

  const setStore = usePaymentLinkStore.getState().setStore
  const persistStore = loadFromLocalStorage(response.link)

  const tipPercent = persistStore?.tipPercent || response?.tipPercent
  const tip = persistStore?.tipAmount || response?.tip

  const storeObject = {
    ...(response.link !== persistStore?.linkId || response.status !== 'ACTIVE'
      ? { ...initialStore, linkId: response.link }
      : {}),
  }

  if (tipType === 'FIXED' && !persistStore?.tipPercent) {
    storeObject.tipAmount = tip
    storeObject.tipPercent = persistStore?.tipPercent ?? 0
  } else if (tipType === 'PERCENT' && !persistStore?.tipAmount) {
    storeObject.tipAmount = persistStore?.tipAmount ?? null
    storeObject.tipPercent = persistStore?.tipPercent ?? tipPercent
  }

  setStore(storeObject)

  return {
    proIcon:
      response?.booking?.pro?.iconUrl ?? response?.quickpay?.pro?.iconUrl,
    proName:
      response?.booking?.pro?.businessName ??
      response?.quickpay?.pro?.businessName,
    createdAt: response?.booking?.createdAt ?? response?.quickpay?.createdAt,
    tip,
    tipPercent,
    addons: response?.booking?.addons ?? [],
    services: response?.booking?.services ?? [],
    currency:
      response?.booking?.pro?.currency ?? response?.quickpay?.pro?.currency,
    taxAmount,
    taxPercent,
    travelFee,
    totalPrice,
    totalAmount: totalAmount,
    quickpay: response?.quickpay?.amount,
    status: response?.status,
    tipType,
    amount: response?.quickpay?.amount ?? response?.booking?.amount,
    bookingId: response?.booking?.id,
    type: response?.type,
    quickpayId: response?.quickpay?.id,
    booking: response?.booking,
  } as TransformPLResponse
}
