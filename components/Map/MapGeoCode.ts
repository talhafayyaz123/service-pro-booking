import { default as MapGeoCode } from 'react-geocode'

MapGeoCode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string)
MapGeoCode.setLanguage('en')

export { MapGeoCode }
