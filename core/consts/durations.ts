export const hourDurations = [
  {
    label: '0 hour',
    value: 0,
  },
  {
    label: '1 hour',
    value: 60,
  },
  {
    label: '2 hours',
    value: 120,
  },
  {
    label: '3 hours',
    value: 180,
  },
  {
    label: '4 hours',
    value: 240,
  },
  {
    label: '5 hours',
    value: 300,
  },
  {
    label: '6 hours',
    value: 360,
  },
  {
    label: '7 hours',
    value: 420,
  },
  {
    label: '8 hours',
    value: 480,
  },
  {
    label: '9 hours',
    value: 540,
  },
  {
    label: '10 hours',
    value: 600,
  },
  {
    label: '11 hours',
    value: 660,
  },
  {
    label: '12 hours',
    value: 720,
  },
]

export const minuteDurations = [
  {
    label: '0 min',
    value: 0,
  },
  {
    label: '15 min',
    value: 15,
  },
  {
    label: '30 min',
    value: 30,
  },
  {
    label: '45 min',
    value: 45,
  },
]

export const extraTimeDurations = [
  {
    label: '15 min',
    value: 15,
  },
  {
    label: '30 min',
    value: 30,
  },
  {
    label: '45 min',
    value: 45,
  },
  {
    label: '1 hour',
    value: 60,
  },
]

export const getDistanceOptions = (isMiles: boolean) => {
  const options = []
  const label = isMiles ? 'miles' : 'km.'
  for (let i = 1; i <= 10; i++) {
    options.push({
      label: `${i} ${label}`,
      value: i,
    })
  }

  return options
}
