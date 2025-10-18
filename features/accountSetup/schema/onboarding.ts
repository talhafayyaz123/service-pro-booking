import { array, bool, InferType, number, object, string } from 'yup'

import { steps, TSteps } from '../helpers/steps'

export const onboardingSchema = ({ step }: { step: TSteps }) =>
  object({
    [steps.welcome]: object({}),
    [steps.trial]: object({}),
    [steps.basicInfo]: object({
      usename: bool().default(false),
      iconUrl: string(),
      businessName: string(),
      bio: string(),
    }).optional(),
    [steps.businessTypes]: object({
      categories: array(string()),
    }),
    [steps.businessDetail]: object({
      isMobile: bool().optional(),
      isVirtual: bool().optional(),
      isInHome: bool().optional(),
      isInVenue: bool().optional(),
      coverArea: object({
        value: number(),
        label: string(),
      }).test({
        test: ({ value }, { parent }) => {
          const isVirtual = parent.isVirtual
          const isMobile = parent.isMobile

          // pass if step is other than Business detail
          if (step !== 'businessDetail' || (isVirtual && !isMobile)) return true

          if (value && value >= 1 && value <= 1000) return true

          return false
        },
        message: ({ value }) => {
          let msg = 'Distance is required.'

          if (value < 1) {
            msg += ' The area I cover must be greater than 1 mile.'
          }

          if (value > 1000) {
            msg += ' The area I cover must not exceed 1000 miles.'
          }

          return msg
        },
      }),
      address: string().test({
        test: (value, { parent }) => {
          const isVirtual = parent.isVirtual
          const isMobile = parent.isMobile
          const isInVenue = parent.isInVenue
          const isInHome = parent.isInHome

          // pass if step is other than Business detail
          if (
            step !== 'businessDetail' ||
            (isVirtual && !isMobile && !isInHome && !isInVenue)
          )
            return true

          if (value && value.length > 0) return true

          return false
        },
        message: 'Address is required',
      }),
      countryCode: string().optional(),
      timezone: string().optional(),
      travelFee: number().optional().typeError('Travel fee must be a number'),
      longitude: number().optional(),
      latitude: number().optional(),
    }),
    [steps.services]: array(
      object({
        categories: array(
          object({
            categoryId: string().required(),
            description: string().optional(),
            duration: number().required(),
            extraTime: number().optional(),
            image: string().optional(),
            isExtraTime: bool().optional(),
            isMobile: bool().optional(),
            key: string().optional(),
            name: string().required(),
            order: number().optional(),
            price: number().required(),
          })
        ).optional(),
        color: string().optional(),
        iconUrl: string().optional(),
        id: string().optional(),
        name: string().optional(),
        order: number().optional(),
        proCount: number().optional(),
      })
    ),
    [steps.portfolio]: object({
      portfolioPhotos: array(
        object({
          id: string().optional(),
          uniqueId: string().optional(),
          url: string().optional(),
          original: string().optional(),
          isCover: bool().optional(),
          order: number().optional(),
        })
      ).test({
        test: (value) => {
          if (value && step === 'portfolio') {
            const values = value?.filter((v) => v.url) || []
            return values?.length >= 2
          }
          return true
        },
        message: 'At least 2 photos are required for your profile to be listed',
      }),
    }),
  })

export type TOnboardingSchema = InferType<ReturnType<typeof onboardingSchema>>
