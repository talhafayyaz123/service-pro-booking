import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'

import { UserIconV2 } from './UserIconV2'

describe('test component ==> UserIconV2', () => {
  const iconUrl = 'https://example.com/icon.png'
  const className = 'custom-class'

  test('renders correctly with iconUrl', () => {
    render(<UserIconV2 iconUrl={iconUrl} className={className} />)

    expect(screen.getByTestId('user-icon-mark')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
    expect(screen.getByTestId('user-icon-mark')).toHaveClass('custom-class')
  })

  test('does not render Image when iconUrl is not provided', () => {
    render(<UserIconV2 />)

    expect(screen.getByTestId('user-icon-mark')).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  test('applies additional className correctly', () => {
    render(<UserIconV2 className={className} />)
    expect(screen.getByTestId('user-icon-mark')).toHaveClass(className)
  })

  test('renders with the correct data-testid', () => {
    render(<UserIconV2 />)

    expect(screen.getByTestId('user-icon-mark')).toBeInTheDocument()
  })
})
