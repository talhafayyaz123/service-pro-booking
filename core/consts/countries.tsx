import ReactCountryFlag from 'react-country-flag'

import { IOptions } from '@/types/common'

import countriesAndPhones from './countryAndPhoneCodes.json'
export const Flag = ({
  countryCode,
  ariaLabel,
  className,
}: {
  countryCode: string | undefined
  ariaLabel?: string
  className?: string
}) => {
  return (
    <>
      {countryCode ? (
        <span className={`flex-shrink-0 flex h-6 overflow-hidden ${className}`}>
          <ReactCountryFlag
            style={{
              fontSize: '24px',
            }}
            svg
            countryCode={countryCode || ''}
            aria-label={ariaLabel || ''}
          />
        </span>
      ) : (
        ''
      )}
    </>
  )
}

export const phoneAndCountriesArr = countriesAndPhones.map((item) => ({
  ...item,
  id: item.code + item.dial_code,
  flag: (
    <div className={'w-6 flex-shrink-0 flex h-6  overflow-hidden'}>
      <ReactCountryFlag
        style={{
          fontSize: '24px',
        }}
        svg
        countryCode={item.code}
        aria-label={item.name}
      />
    </div>
  ),
}))

export const phoneAndCountriesObj: Record<string, any> =
  phoneAndCountriesArr.reduce((acc, item) => ({ ...acc, [item.id]: item }), {})

export const phoneOptions = phoneAndCountriesArr.map((item) => ({
  value: item.dial_code,
  id: item.id,
  search: item.name,
  label: (
    <div className="flex items-center">
      <Flag countryCode={item.code} ariaLabel={item.name} />
      <span className="pl-2.5 mr-1.5">{item.dial_code}, </span>

      <span className="pl-1.5 truncate">{item.name}</span>
    </div>
  ),
}))

export const phoneOptionsObj: Record<string, IOptions> = phoneOptions.reduce(
  (acc, item) => ({ ...acc, [item.id]: item }),
  {}
)

export const defaultPhoneCode = phoneOptions[0]

export const countryOptions = phoneAndCountriesArr.map((item) => ({
  value: item.dial_code,
  id: item.id,
  search: item.name,
  country: item.code,
  label: (
    <div className={'flex items-center gap-[10px] '}>
      <Flag countryCode={item.code} ariaLabel={item.name} />
      <span className={'pl-1.5 truncate'}>{item.name}</span>
    </div>
  ),
}))

export const usaStates = [
  {
    name: 'Alabama',
    abbreviation: 'AL',
  },
  {
    name: 'Alaska',
    abbreviation: 'AK',
  },
  {
    name: 'American Samoa',
    abbreviation: 'AS',
  },
  {
    name: 'Arizona',
    abbreviation: 'AZ',
  },
  {
    name: 'Arkansas',
    abbreviation: 'AR',
  },
  {
    name: 'California',
    abbreviation: 'CA',
  },
  {
    name: 'Colorado',
    abbreviation: 'CO',
  },
  {
    name: 'Connecticut',
    abbreviation: 'CT',
  },
  {
    name: 'Delaware',
    abbreviation: 'DE',
  },
  {
    name: 'District Of Columbia',
    abbreviation: 'DC',
  },
  {
    name: 'Federated States Of Micronesia',
    abbreviation: 'FM',
  },
  {
    name: 'Florida',
    abbreviation: 'FL',
  },
  {
    name: 'Georgia',
    abbreviation: 'GA',
  },
  {
    name: 'Guam',
    abbreviation: 'GU',
  },
  {
    name: 'Hawaii',
    abbreviation: 'HI',
  },
  {
    name: 'Idaho',
    abbreviation: 'ID',
  },
  {
    name: 'Illinois',
    abbreviation: 'IL',
  },
  {
    name: 'Indiana',
    abbreviation: 'IN',
  },
  {
    name: 'Iowa',
    abbreviation: 'IA',
  },
  {
    name: 'Kansas',
    abbreviation: 'KS',
  },
  {
    name: 'Kentucky',
    abbreviation: 'KY',
  },
  {
    name: 'Louisiana',
    abbreviation: 'LA',
  },
  {
    name: 'Maine',
    abbreviation: 'ME',
  },
  {
    name: 'Marshall Islands',
    abbreviation: 'MH',
  },
  {
    name: 'Maryland',
    abbreviation: 'MD',
  },
  {
    name: 'Massachusetts',
    abbreviation: 'MA',
  },
  {
    name: 'Michigan',
    abbreviation: 'MI',
  },
  {
    name: 'Minnesota',
    abbreviation: 'MN',
  },
  {
    name: 'Mississippi',
    abbreviation: 'MS',
  },
  {
    name: 'Missouri',
    abbreviation: 'MO',
  },
  {
    name: 'Montana',
    abbreviation: 'MT',
  },
  {
    name: 'Nebraska',
    abbreviation: 'NE',
  },
  {
    name: 'Nevada',
    abbreviation: 'NV',
  },
  {
    name: 'New Hampshire',
    abbreviation: 'NH',
  },
  {
    name: 'New Jersey',
    abbreviation: 'NJ',
  },
  {
    name: 'New Mexico',
    abbreviation: 'NM',
  },
  {
    name: 'New York',
    abbreviation: 'NY',
  },
  {
    name: 'North Carolina',
    abbreviation: 'NC',
  },
  {
    name: 'North Dakota',
    abbreviation: 'ND',
  },
  {
    name: 'Northern Mariana Islands',
    abbreviation: 'MP',
  },
  {
    name: 'Ohio',
    abbreviation: 'OH',
  },
  {
    name: 'Oklahoma',
    abbreviation: 'OK',
  },
  {
    name: 'Oregon',
    abbreviation: 'OR',
  },
  {
    name: 'Palau',
    abbreviation: 'PW',
  },
  {
    name: 'Pennsylvania',
    abbreviation: 'PA',
  },
  {
    name: 'Puerto Rico',
    abbreviation: 'PR',
  },
  {
    name: 'Rhode Island',
    abbreviation: 'RI',
  },
  {
    name: 'South Carolina',
    abbreviation: 'SC',
  },
  {
    name: 'South Dakota',
    abbreviation: 'SD',
  },
  {
    name: 'Tennessee',
    abbreviation: 'TN',
  },
  {
    name: 'Texas',
    abbreviation: 'TX',
  },
  {
    name: 'Utah',
    abbreviation: 'UT',
  },
  {
    name: 'Vermont',
    abbreviation: 'VT',
  },
  {
    name: 'Virgin Islands',
    abbreviation: 'VI',
  },
  {
    name: 'Virginia',
    abbreviation: 'VA',
  },
  {
    name: 'Washington',
    abbreviation: 'WA',
  },
  {
    name: 'West Virginia',
    abbreviation: 'WV',
  },
  {
    name: 'Wisconsin',
    abbreviation: 'WI',
  },
  {
    name: 'Wyoming',
    abbreviation: 'WY',
  },
].map((el) => ({ value: el.abbreviation, label: el.name }))
