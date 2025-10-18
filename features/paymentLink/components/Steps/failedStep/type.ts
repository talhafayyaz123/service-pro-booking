export interface IFailedStepProps {
  price: number | string
  currency?: string
  error?: string
  handleTryAgain?: () => void
}
