import { useCallback } from 'react'
import * as yup from 'yup'

type ResolverResult<T> = {
  values: T
  errors: Record<string, { type: string; message: string }>
}

// Define a type for the resolver function
type Resolver<T> = (data: T) => Promise<ResolverResult<T>>

export const useYupValidationResolver = <T extends Record<string, unknown>>(
  validationSchema: yup.AnyObjectSchema
): Resolver<T> =>
  useCallback(
    async (data: T): Promise<ResolverResult<T>> => {
      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        })

        return {
          values,
          errors: {},
        }
      } catch (errors) {
        return {
          values: {} as T,
          errors: (errors as yup.ValidationError)?.inner?.reduce(
            (allErrors, currentError) => {
              if (currentError.path) {
                return {
                  ...allErrors,
                  [currentError.path]: {
                    type: currentError.type ?? 'validation',
                    message: currentError.message,
                  },
                }
              }
              return allErrors
            },
            {}
          ),
        }
      }
    },
    [validationSchema]
  )
