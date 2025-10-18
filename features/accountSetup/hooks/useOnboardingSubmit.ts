import { useMutation } from '@tanstack/react-query'

import { stepBasic } from '@/api/onboarding-pro/basic-info'
import { stepBusinessDetail } from '@/api/onboarding-pro/business-detail'
import { stepBusinessTypes } from '@/api/onboarding-pro/business-types'
import { stepPortfolio } from '@/api/onboarding-pro/portfolio'
import { addProServices } from '@/api/pro/addProServices'
import { steps, TSteps } from '@/features/accountSetup/helpers/steps'
import { TOnboardingSchema } from '@/features/accountSetup/schema/onboarding'
import { ICategoryService } from '@/types/categoriesTypes'
import { IBusinessDetail, IPortfolio } from '@/types/onboarding'

export const useOnboardingSubmit = ({
  step,
  onNextStep,
}: {
  step: TSteps
  onNextStep: () => void
}) => {
  const basicMutation = useMutation({
    mutationFn: async (data: TOnboardingSchema['basicInfo']) => {
      return stepBasic({
        businessName: data.businessName || '',
        iconUrl: data.iconUrl || '',
        bio: data.bio || '',
      })
    },
    onSuccess: () => {
      onNextStep()
    },
  })

  const businessTypesMutation = useMutation({
    mutationFn: async (data: TOnboardingSchema['businessTypes']) => {
      return stepBusinessTypes({
        categories: data.categories as string[],
      })
    },
    onSuccess: () => {
      onNextStep()
    },
  })

  const businessDetailMutation = useMutation({
    mutationFn: async (data: TOnboardingSchema['businessDetail']) => {
      const body = data as Omit<IBusinessDetail, 'coverArea'>
      return stepBusinessDetail({
        ...body,
        coverArea: data.coverArea?.value || 0,
      })
    },
    onSuccess: () => {
      onNextStep()
    },
  })

  const servicesMutation = useMutation({
    mutationFn: async (data: ICategoryService[]) => {
      return addProServices(data)
    },
    onSuccess: () => {
      onNextStep()
    },
  })
  const portfolioMutation = useMutation({
    mutationFn: async (data: TOnboardingSchema['portfolio']) => {
      const filtered = data?.portfolioPhotos?.filter(
        (photo) => photo?.url
      ) as IPortfolio['portfolioPhotos']

      const photos = filtered?.map((photo, index) => ({
        url: photo.url,
        order: index,
      })) as IPortfolio['portfolioPhotos']

      return stepPortfolio({ portfolioPhotos: photos })
    },
    onSuccess: () => {
      onNextStep()
    },
  })

  const action: Record<TSteps, any> = {
    [steps.welcome]: onNextStep,
    [steps.basicInfo]: basicMutation.mutate,
    [steps.businessTypes]: businessTypesMutation.mutate,
    [steps.businessDetail]: businessDetailMutation.mutate,
    [steps.services]: servicesMutation.mutate,
    [steps.portfolio]: portfolioMutation.mutate,
    [steps.trial]: onNextStep,
  }

  return action[step]
}
