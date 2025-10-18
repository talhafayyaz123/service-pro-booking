// TransactionSection.test.tsx

import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import { formatPrice } from '@/core/helpers/formatPrice'

import { TransactionSection } from './TransactionSection'

describe('test component ==> TransactionSection', () => {
  test('renders correctly with all props', () => {
    const priceDetails = [
      { label: 'Item 1', value: 100 },
      { label: 'Item 2', value: 200 },
    ]
    const currency = 'usd'
    const totalPriceWithTips = 300

    render(
      <TransactionSection
        priceDetails={priceDetails}
        currency={currency}
        totalPriceWithTips={totalPriceWithTips}
        isCheckoutLink={false}
      />
    )

    expect(screen.getByText('Transaction summary')).toBeInTheDocument()

    priceDetails.forEach((detail) => {
      const text = formatPrice({ currency, price: detail.value })
      expect(screen.getByText(detail.label)).toBeInTheDocument()
      expect(screen.getByText(text)).toBeInTheDocument()
    })

    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  test('renders correctly without optional props', () => {
    render(<TransactionSection isCheckoutLink={false} />)

    expect(screen.getByText('Transaction summary')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('$0.00')).toBeInTheDocument() // Default value from formatPrice
  })

  test('correctly formats prices', () => {
    const priceDetails = [
      { label: 'Item 1', value: 150 },
      { label: 'Item 2', value: 250 },
    ]
    const currency = 'eur'
    const totalPriceWithTips = 400

    render(
      <TransactionSection
        priceDetails={priceDetails}
        currency={currency}
        totalPriceWithTips={totalPriceWithTips}
        isCheckoutLink={false}
      />
    )

    priceDetails.forEach((detail) => {
      const test = formatPrice({ currency, price: detail.value })
      expect(screen.getByText(test)).toBeInTheDocument()
    })
    expect(
      screen.getByText(
        formatPrice({
          currency,
          price: totalPriceWithTips,
        })
      )
    ).toBeInTheDocument()
  })

  test('renders empty price details correctly', () => {
    const currency = 'usd'
    const totalPriceWithTips = 100

    render(
      <TransactionSection
        currency={currency}
        totalPriceWithTips={totalPriceWithTips}
        isCheckoutLink={false}
      />
    )

    expect(screen.queryAllByRole('listitem').length).toBe(0)
    expect(
      screen.getByText(formatPrice({ currency, price: totalPriceWithTips }))
    ).toBeInTheDocument()
  })
})
