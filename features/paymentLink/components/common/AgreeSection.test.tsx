import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { AgreeSection } from '@/features/paymentLink/components/common/AgreeSection'
import { TUseBaseInfo } from '@/features/paymentLink/components/Steps/BaseInfoStep/useBaseInfoStep'

const setup = (props: Partial<TUseBaseInfo> = {}) => {
  const defaultProps: Pick<
    TUseBaseInfo,
    'isOpenDrawer' | 'setIsOpenDrawer' | 'isAgree' | 'handleClickAgree'
  > = {
    isOpenDrawer: false,
    setIsOpenDrawer: jest.fn(),
    isAgree: false,
    handleClickAgree: jest.fn(),
  }

  return render(<AgreeSection {...defaultProps} {...props} />)
}

describe('test component ===> AgreeSection', () => {
  it('renders correctly', () => {
    setup()
    const termsAndConditions = screen.getByTestId('terms-and-conditions')
    const checkbox = screen.getByTestId('agreeSection-checkbox')
    expect(checkbox).toBeInTheDocument()
    expect(termsAndConditions).toBeInTheDocument()
  })

  it('handles checkbox change', () => {
    const handleClickAgreeMock = jest.fn()
    setup({ handleClickAgree: handleClickAgreeMock })
    const checkbox = screen.getByTestId('agreeSection-checkbox')

    fireEvent.click(checkbox)

    expect(handleClickAgreeMock).toHaveBeenCalled()
  })

  it('opens the drawer', () => {
    const setIsOpenDrawerMock = jest.fn()
    const handleClickAgreeMock = jest.fn()

    render(
      <AgreeSection
        handleClickAgree={handleClickAgreeMock}
        isAgree={false}
        isOpenDrawer={false}
        setIsOpenDrawer={setIsOpenDrawerMock}
      />
    )

    const termsAndCond = screen.getByTestId('terms-and-conditions')

    fireEvent.click(termsAndCond)
    expect(setIsOpenDrawerMock).toHaveBeenCalledWith(true)
  })
})
