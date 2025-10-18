import { createSelector } from 'reselect'

import { getDiffDays } from '@/core/helpers/helperForDate'
import { RootStateType } from '@/store/rootStore'

const me = (state: RootStateType) => state.me

export const meSelector = createSelector(me, ({ me }) => {
  return {
    ...me,
    subscription: {
      ...me.subscription,
      plan: me?.subscription?.plan ? plans[me?.subscription?.plan] : '',
      datePlan: me?.subscription?.plan,
    },
  }
})

export const cardMe = createSelector(me, (me) => {
  if (me.me.subscription?.stripeCardBrand) {
    return me.me.subscription
  } else {
    return me.me?.subscriptions?.find((el) =>
      ['ACTIVE', 'CANCELLED'].includes(el?.type || '')
    )
  }
})

export const plans = {
  year: 'annual',
  month: 'monthly',
}

export const saveCategoryDisabled = createSelector(
  me,
  ({ me, meReference, sendStatus }) => {
    const different =
      JSON.stringify(me?.categories.map((el) => el.id).sort()) ===
      JSON.stringify(meReference?.categories.map((el) => el.id).sort())
    return {
      disabled: meReference?.categories.length === 0 || different || sendStatus,
      me,
      meReference,
    }
  }
)
export const meSubscriptionsPlan = createSelector(me, ({ me }) => {
  return {
    ...me?.subscription,
    leftDays: getDiffDays(me?.subscription?.expireAt, new Date()) || 0,
  }
})
export const meSubscriptionsPlanInfoSelector = createSelector(me, ({ me }) => {
  const leftProPlanDays = +(
    me.subscription?.expireAt
      ? getDiffDays(me?.subscription?.expireAt, new Date())
      : -1
  ).toFixed(0)
  const leftTrialPlanDays = +(
    me.trialSubscription?.expireAt
      ? getDiffDays(me?.trialSubscription?.expireAt, new Date())
      : -1
  ).toFixed(0)

  const getCurrentPlan = (): 'PRO_PLAN' | 'TRIAL_PLAN' | 'FREE_PLAN' => {
    if (leftProPlanDays >= 0) {
      return 'PRO_PLAN'
    } else if (leftTrialPlanDays >= 0) {
      return 'TRIAL_PLAN'
    } else {
      return 'FREE_PLAN'
    }
  }

  return {
    leftProPlanDays: leftProPlanDays >= 0 ? leftProPlanDays : 0,
    leftTrialPlanDays,
    currentPlan: getCurrentPlan(),
    proExpiredAt: me?.subscription?.expireAt,
    trialExpiredAt: me?.trialSubscription?.expireAt,
  }
})

export const meTrialSubscriptionPlan = createSelector(me, ({ me }) => {
  if (!me?.trialSubscription) {
    return null
  }

  return {
    ...me.trialSubscription,
    leftDays: getDiffDays(me?.trialSubscription.expireAt, new Date()) || 0,
  }
})

export const isHaveNameSelector = createSelector(me, ({ me }) => {
  return !(me.firstName || '').trim() && !(me.lastName || '').trim()
})
