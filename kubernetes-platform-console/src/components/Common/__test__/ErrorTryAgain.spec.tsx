import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import ErrorTryAgain from 'components/Common/ErrorTryAgain'

describe('ErrorTryAgain render UI result', () => {
  it('should render successfully', () => {
    const { getByText } = render(<ErrorTryAgain tryAgain={() => undefined} />)
    expect(getByText('Something wrong happened')).toBeInTheDocument()
    expect(getByText('Try again')).toBeInTheDocument()
  })

  it('should trigger handleClick once when "Try again" button is called', () => {
    const handleClick = jest.fn()
    const { getByText } = render(<ErrorTryAgain tryAgain={handleClick} />)
    fireEvent.click(getByText('Try again'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should display mock message and btnText', () => {
    const mockMessage = 'test message'
    const mockBtnText = 'test button text'
    const { getByText } = render(
      <ErrorTryAgain tryAgain={() => undefined} message={mockMessage} btnText={mockBtnText} />
    )
    expect(getByText(mockMessage)).toBeInTheDocument()
    expect(getByText(mockBtnText)).toBeInTheDocument()
  })
})
