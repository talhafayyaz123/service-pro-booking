import { GoogleMapProps } from '@react-google-maps/api'
import googleMapReact from 'google-map-react'

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [
      {
        weight: '2.00',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'geometry.stroke',
    stylers: [
      {
        color: '#9C9C9C',
      },
    ],
  },
  {
    featureType: 'all',
    elementType: 'labels.text',
    stylers: [
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [
      {
        color: '#F2F2F2',
      },
    ],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#E8E9FF',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#E8E9FF',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [
      {
        saturation: -100,
      },
      {
        lightness: 45,
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#FFFFFF',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#7B7B7B',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#FFFFFF',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [
      {
        visibility: 'simplified',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [
      {
        color: '#CCCFFC',
      },
      {
        visibility: 'on',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#CCCFFC',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#070707',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#FFFFFF',
      },
    ],
  },
]

export const defaultCenter = {
  lat: 43.822778,
  lng: -95.212354,
}

export const mapOptions: googleMapReact.Props['options'] = {
  draggable: true,
  streetViewControl: false,
  panControl: false,
  zoomControl: false,
  mapTypeControl: false,
  scaleControl: false,
  rotateControl: false,
  fullscreenControl: false,
  styles: mapStyles,
  clickableIcons: false,
  minZoom: 4,
  maxZoom: 14,
  gestureHandling: 'cooperative',
}

export const standardMapOptions: googleMapReact.Props = {
  options: mapOptions,
  bootstrapURLKeys: {
    key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
    libraries: ['places'],
  },
  yesIWantToUseGoogleMapApiInternals: true,
  center: defaultCenter,
  zoom: 4,
}

export const locationMapOptions: GoogleMapProps = {
  options: { ...mapOptions },
  center: defaultCenter,
  clickableIcons: false,
  zoom: 4,
}

// Custom website

const stylesTheme1Map = [
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      {
        color: '#fbf8f1',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [
      {
        color: '#e8e5de',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f0ede6',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#c9c9c9',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
]

export const theme1MapOptions: GoogleMapProps = {
  options: { ...mapOptions, styles: stylesTheme1Map, scrollwheel: true },
  center: defaultCenter,
  clickableIcons: false,
  zoom: 14,
}

const stylesTheme2Map = [
  {
    elementType: 'geometry',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.country',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#bdbdbd',
      },
    ],
  },
  {
    featureType: 'administrative.neighborhood',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'administrative.province',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f5f5f5',
      },
    ],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry',
    stylers: [
      {
        color: '#f3f3f2',
      },
    ],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'landscape.natural.landcover',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'landscape.natural.terrain',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'poi.business',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'poi.medical',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'poi.school',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dddddd',
      },
    ],
  },
  {
    featureType: 'poi.sports_complex',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dddddd',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ffffff',
      },
    ],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#757575',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#616161',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dadada',
      },
    ],
  },
  {
    featureType: 'road.local',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [
      {
        color: '#e5e5e5',
      },
    ],
  },
  {
    featureType: 'transit.station',
    elementType: 'geometry',
    stylers: [
      {
        color: '#eeeeee',
      },
    ],
  },
  {
    featureType: 'transit.station.airport',
    elementType: 'geometry',
    stylers: [
      {
        color: '#ebebea',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [
      {
        color: '#dddddd',
      },
    ],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [
      {
        color: '#9e9e9e',
      },
    ],
  },
]

export const theme2MapOptions: GoogleMapProps = {
  options: { ...mapOptions, styles: stylesTheme2Map, scrollwheel: true },
  center: defaultCenter,
  clickableIcons: false,
  zoom: 14,
}
