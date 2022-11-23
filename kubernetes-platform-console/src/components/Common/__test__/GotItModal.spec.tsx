import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

import GotItModal from 'components/Common/GotItModal'

const MOCK_TEXT = 'Mock ske console GotItModal'

describe('GotItModal render UI result', () => {
  it('should render successfully', () => {
    const { getByText } = render(<GotItModal visible={true}>{MOCK_TEXT}</GotItModal>)
    expect(getByText(MOCK_TEXT)).toBeInTheDocument()
  })

  it('should render "Got it !" when "deployConfigEnable" is true', () => {
    const { getByText } = render(
      <GotItModal visible={true} deployConfigEnable={true}>
        {MOCK_TEXT}
      </GotItModal>
    )
    expect(getByText('Got it !')).toBeInTheDocument()
  })

  it('should not render "Got it !" when "deployConfigEnable" is false', () => {
    const { queryByText } = render(
      <GotItModal visible={true} deployConfigEnable={false}>
        {MOCK_TEXT}
      </GotItModal>
    )
    expect(queryByText('Got it !')).not.toBeInTheDocument()
  })
})
