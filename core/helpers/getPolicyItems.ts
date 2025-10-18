import { POLICIES } from '@/core/consts/customWebsiteTexts'
import {
  getPayInAppTextByDepositType,
  getPayInBnplText,
  getPayInCashTextByDepositType,
} from '@/features/profile/components/termsOfPayment/ProfileTermsOfPayment'
import { getCancellationPolicyType } from '@/shared/cancelations/CancellationPolicyText'
import { IPolicyProps, IWebsiteDataProps } from '@/types/customWebsite'

export const getPolicyItems = (data: IWebsiteDataProps): IPolicyProps[] => {
  return [
    {
      title: POLICIES.in_app.title,
      description: getPayInAppTextByDepositType(
        data.termsOfPayments,
        data.pro.businessName
      ),
      isVisible:
        data.termsOfPayments.depositType !== 'OFF' ||
        data.termsOfPayments.payInApp,
    },
    {
      title: POLICIES.cash.title,
      description: getPayInCashTextByDepositType(
        data.termsOfPayments,
        data.pro.businessName
      ),
      isVisible: data.termsOfPayments.payInCash,
    },
    {
      title: POLICIES.bnpl.title,
      description: getPayInBnplText(data.pro.businessName),
      isVisible: data.termsOfPayments.payInBnpl,
    },
    {
      title: POLICIES.cancellation_policy.title,
      description: getCancellationPolicyType(
        data.termsOfPayments.depositType,
        data.pro.businessName,
        data.termsOfPayments.cancellationRule,
        data.termsOfPayments.amount,
        data.termsOfPayments.percentOfService
      ),
      isVisible: true,
    },
    {
      title: POLICIES.additional_policy.title,
      description: data.termsOfPayments.description,
      isVisible: !!data.termsOfPayments.description,
    },
  ]
}
