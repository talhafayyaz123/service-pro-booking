import countriesAndPhones from './countryAndPhoneCodes.json'

export const phoneCodes = countriesAndPhones.map(({ dial_code, code }) => ({
  label: dial_code,
  value: dial_code,
  key: code,
}))
