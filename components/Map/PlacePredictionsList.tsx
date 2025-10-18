import { H16 } from '../typography'

interface Props {
  predictions: google.maps.places.AutocompletePrediction[]
  wrapperClassName?: string
  onSelect: (place_id: string, description: string) => void
}

export const PlacePredictionsList = ({
  predictions,
  onSelect,
  wrapperClassName = '',
}: Props) => {
  return (
    <div
      className={`absolute z-50 w-full p-2 translate-y-full bg-white shadow-xl rounded-xl -bottom-1 ${wrapperClassName}`}
    >
      {predictions.map((place) => {
        return (
          <div
            role="button"
            className={`py-1 group cursor-pointer`}
            key={place.place_id}
            onClick={() => onSelect(place.place_id, place.description)}
          >
            <H16
              className={`p-2 transition ${
                'value' === place.description
                  ? '!text-white'
                  : 'group-hover:!text-orange'
              }`}
            >
              {place.description}
            </H16>
          </div>
        )
      })}
    </div>
  )
}
