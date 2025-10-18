const check = {
  otp: 'otp',
  welcome: 'welcome',
  basicInfo: 'basicInfo',
  businessTypes: 'businessTypes',
  businessDetail: 'businessDetail',
  services: 'services',
  portfolio: 'portfolio',
}

type TSteps = typeof check[keyof typeof check]

export function getLastStep({
  steps,
}: {
  steps: {
    [key in TSteps]: boolean
  }
}) {
  const arr = [
    check.otp,
    check.welcome,
    check.basicInfo,
    check.businessTypes,
    check.businessDetail,
    check.services,
    check.portfolio,
  ]

  const last = arr.find((step) => steps[step] === false)

  return { last }
}
