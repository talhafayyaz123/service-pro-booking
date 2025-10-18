import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'

import { formatPrice } from '@/core/helpers/formatPrice'
import { TipSection } from '@/features/paymentLink/components/common/TipSection'
import { TUseBaseInfo } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'
import { buttonsPercent } from '@/features/paymentLink/constants'
import { TransformPLResponse } from '@/features/paymentLink/store/types'

const setup = (props: Partial<TUseBaseInfo> = {}) => {
  const defaultProps: Pick<
    TUseBaseInfo,
    'tipPercent' | 'setStore' | 'currency' | 'tipAmount' | 'data'
  > = {
    tipPercent: null,
    setStore: jest.fn(),
    currency: 'usd',
    tipAmount: null,
    data: {
      totalAmount: 100,
    } as TransformPLResponse,
  }

  return render(<TipSection {...defaultProps} {...props} />)
}

describe('test component ===> TipSection', () => {
  it('renders correctly', () => {
    setup()

    expect(screen.getByText('Select tip amount')).toBeInTheDocument()
    expect(
      screen.getByText('Select tip percent, enter custom amount, or skip this')
    ).toBeInTheDocument()
  })
  it('renders correctly buttons with percent tips', () => {
    const props = {
      currency: 'usd',
      tipAmount: null,
      tipPercent: null,
      setStore: jest.fn(),
      data: {
        totalAmount: 100,
      } as TransformPLResponse,
    }
    setup(props)
    buttonsPercent.forEach((percent) => {
      const textPrice = screen.getByTestId(`tip-section-in-price-by-${percent}`)
      const button = screen.getByText(`${percent}%`)
      expect(textPrice).toHaveTextContent(
        formatPrice({
          price: (props?.data?.totalAmount ?? 0) * (percent / 100),
          currency: props.currency,
        })
      )
      expect(button).toBeInTheDocument()
    })
  })
  it('selects a tip percent and updates state', () => {
    const setStoreMock = jest.fn()
    setup({ setStore: setStoreMock })

    fireEvent.click(screen.getByText('10%'))

    expect(setStoreMock).toHaveBeenCalledWith({
      tipAmount: null,
      tipPercent: 10,
      tipAmountFinal: 10,
    })
  })

  it('unselects a tip percent and updates state', () => {
    const setStoreMock = jest.fn()
    setup({ setStore: setStoreMock, tipPercent: 10 })
    const button = screen.getByText('10%').parentElement
    fireEvent.click(button as HTMLElement)
    expect(button).toHaveClass('bg-orange')

    expect(setStoreMock).toHaveBeenCalledWith({
      tipAmount: null,
      tipPercent: null,
      tipAmountFinal: null,
    })
  })

  it('updates custom tip amount and updates state', () => {
    const setStoreMock = jest.fn()
    setup({ setStore: setStoreMock })
    const input = screen.getByPlaceholderText('Enter custom gratuity')
    fireEvent.change(input, {
      target: { value: '15' },
    })

    expect(setStoreMock).toHaveBeenCalledWith({
      tipPercent: null,
      tipAmount: 15,
      tipAmountFinal: 15,
    })
  })
})
