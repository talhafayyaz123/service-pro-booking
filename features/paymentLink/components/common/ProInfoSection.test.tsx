import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import moment from 'moment'

import { ProInfoSection } from './ProInfoSection'

describe('tests component ==> ProInfoSection', () => {
  test('renders correctly with all props', () => {
    const businessName = 'Example Business'
    const date = '2024-08-04T15:00:00Z'
    const iconUrl = 'https://example.com/icon.png'

    render(
      <ProInfoSection
        businessName={businessName}
        date={date}
        iconUrl={iconUrl}
      />
    )

    expect(screen.getByText(businessName)).toBeInTheDocument()
    expect(
      screen.getByText(moment(date).format('DD MMM YYYY [at] ha'))
    ).toBeInTheDocument()
  })

  test('renders correctly without optional props', () => {
    render(<ProInfoSection />)

    expect(screen.queryByText(/Example Business/i)).not.toBeInTheDocument()
    expect(screen.queryByText(/DD MMM YYYY [at] ha/i)).not.toBeInTheDocument()
  })

  test('formats date correctly', () => {
    const businessName = 'Business Test'
    const date = '2024-08-04T08:30:00Z'

    render(<ProInfoSection businessName={businessName} date={date} />)

    expect(
      screen.getByText(moment(date).format('DD MMM YYYY [at] ha'))
    ).toBeInTheDocument()
  })

  test('does not render date-related text if date is not provided', () => {
    const businessName = 'Business Test'

    render(<ProInfoSection businessName={businessName} />)
    expect(screen.getByTestId('pro-info-date')).toHaveTextContent('')
  })
})
