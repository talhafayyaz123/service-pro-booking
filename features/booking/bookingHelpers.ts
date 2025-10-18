import { NextRouter } from 'next/router'

import { ROUTES } from '@/core/consts/routes'

import { PAYMENT_METHODS } from './confirmBooking/PaymentDropdown'

export const deleteServiceFromQuery = (router: NextRouter, id: string) => {
  const { proId, ...query } = router.query
  let selectedServices = query.selectedServices
  if (typeof selectedServices === 'string' && selectedServices.length) {
    const servicesIdArr = selectedServices?.split(',')
    const _ = servicesIdArr?.filter((i) => i !== id)
    selectedServices = _.join(',')
  }

  if (selectedServices?.length) {
    query['selectedServices'] = selectedServices
  } else {
    delete query['selectedServices']
  }

  router.replace(
    {
      pathname: ROUTES.booking(proId as string),
      query,
    },
    undefined,
    { shallow: true }
  )
}

export const addServiceToQuery = (router: NextRouter, id: string) => {
  const { proId, ...query } = router.query

  let selectedServices = query.selectedServices
  if (selectedServices?.length && typeof selectedServices === 'string') {
    const servicesIdArr = selectedServices.split(',')
    if (!servicesIdArr.includes(id)) {
      servicesIdArr.push(id)
    }
    selectedServices = servicesIdArr.join(',')
  }
  router.replace(
    {
      pathname: ROUTES.booking(proId as string),
      query: {
        ...query,
        selectedServices: selectedServices?.length ? selectedServices : id,
      },
    },
    undefined,
    { shallow: true }
  )
}

export const addServicesToQuery = (router: NextRouter, ids: string[]) => {
  const { proId, ...query } = router.query

  const _ids = ids.join(',')
  if (_ids.length) {
    query['selectedServices'] = _ids
  } else {
    delete query['selectedServices']
  }

  router.replace(
    {
      pathname: ROUTES.booking(proId as string),
      query,
    },
    undefined,
    { shallow: true }
  )
}

export const checkIsPayInCash = (s?: string | null | number) =>
  s === PAYMENT_METHODS.PAY_IN_CASH

export const checkIsPayWithCard = (s?: string | null | number) =>
  s === PAYMENT_METHODS.PAY_IN_APP

export const checkIsPayBnpl = (s?: string | null | number) =>
  s === PAYMENT_METHODS.PAY_IN_BNPL
