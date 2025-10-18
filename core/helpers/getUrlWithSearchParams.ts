import queryString, { StringifyOptions } from 'query-string'

import { baseURL } from '@/store/instance'

export const getUrlWithSearchParams = (
  baseUrl: string,
  queryParamsProps: any,
  options?: StringifyOptions & { skipValues?: (number | string)[] }
) => {
  const newQueryParamsProps = options
    ? filtered(
        options.skipValues,
        queryParamsProps,
        Object.keys(queryParamsProps)
      ).reduce(
        (acc: any, el: any) => ({
          ...acc,
          [el]: queryParamsProps[el as keyof typeof queryParamsProps],
        }),
        {}
      )
    : queryParamsProps

  return queryString.stringifyUrl(
    { url: baseUrl, query: newQueryParamsProps },
    { skipEmptyString: true, skipNull: true, ...options }
  )
}

export const getServerSideUrl = (url: string, base?: string) => {
  return new URL(url, base ?? baseURL).toString()
}

const filtered = (
  v: (string | number)[] | undefined,
  queries: any,
  arr: any[]
) => {
  return v
    ? arr.filter((el: string) => {
        return !v.includes(queries[el as keyof typeof queries])
      })
    : arr
}
