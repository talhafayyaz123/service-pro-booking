import { act, fireEvent, render, screen } from '@testing-library/react'
import React from 'react'

import { OTP_TIMEFRAME } from '@/core/consts/common'

import { OTPVerify } from './OTPVerify'

describe('OTPVerify', () => {
  jest.useFakeTimers()

  const defaultProps = {
    title: <span>Title</span>,
    subtitle: <span>Subtitle</span>,
    showTimer: true,
    resendVerifyCode: jest.fn(),
    footer: jest.fn(),
    error: '',
  }

  it('renders title and subtitle correctly', () => {
    render(<OTPVerify {...defaultProps} />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('handles OTP input and focus correctly', async () => {
    render(<OTPVerify {...defaultProps} />)
    const input1 = screen.getByTestId('otp-input-index-1')
    const input2 = screen.getByTestId('otp-input-index-2')
    const input3 = screen.getByTestId('otp-input-index-3')
    const input4 = screen.getByTestId('otp-input-index-4')

    fireEvent.change(input1, { target: { value: '1' } })
    expect(input2).toHaveFocus()

    fireEvent.change(input2, { target: { value: '2' } })
    expect(input3).toHaveFocus()

    fireEvent.change(input3, { target: { value: '3' } })
    expect(input4).toHaveFocus()
    fireEvent.change(input4, { target: { value: '4' } })
    //удаляем value и Backspace что бы проверить сработает ли фокус на предыдущий инпут
    fireEvent.change(input4, { target: { value: '' } })

    fireEvent.keyDown(input4, { key: 'Backspace' })
    expect(input3).toHaveFocus()

    fireEvent.change(input3, { target: { value: '' } })
    fireEvent.keyDown(input3, { key: 'Backspace' })

    expect(input2).toHaveFocus()

    fireEvent.change(input2, { target: { value: '' } })
    fireEvent.keyDown(input2, { key: 'Backspace' })
    expect(input1).toHaveFocus()

    fireEvent.change(input1, { target: { value: '' } })
    fireEvent.keyDown(input1, { key: 'Backspace' })
    expect(input1).toHaveFocus()
  })
  jest.useFakeTimers()

  it('calls resendVerifyCode on button click', () => {
    const resendVerifyCodeMock = jest.fn()
    render(
      <OTPVerify {...defaultProps} resendVerifyCode={resendVerifyCodeMock} />
    )

    expect(screen.getByText('5:00')).toBeInTheDocument()
    ;[...new Array(OTP_TIMEFRAME)].forEach(() => {
      act(() => {
        jest.advanceTimersByTime(1000)
      })
    })
    expect(screen.getByText('Please resend the code')).toBeInTheDocument()
    const resendButton = screen.getByText('Resend Code')
    fireEvent.click(resendButton)
    expect(resendVerifyCodeMock).toBeCalled()
  })
  afterEach(() => {
    jest.clearAllTimers()
  })

  it('displays error message if error prop is provided', () => {
    render(<OTPVerify {...defaultProps} error="Some error message" />)
    expect(screen.getByText('Some error message')).toBeInTheDocument()
  })

  it('calls footer function with OTP value', () => {
    const footerMock = jest.fn()
    render(<OTPVerify {...defaultProps} footer={footerMock} />)

    expect(footerMock).toHaveBeenCalledWith('')
  })

  afterEach(() => {
    jest.clearAllTimers()
  })
})
