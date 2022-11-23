import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import PromptCreator from 'components/Common/PromptCreator'
import { BrowserRouter, Link } from 'react-router-dom'

describe('PromptCreator config and return tests!', () => {
  it('should create Prompt and Confirm successfully when "config" is empty!', () => {
    const { Prompt, Confirm } = PromptCreator({})
    expect(Prompt).not.toBeUndefined()
    expect(Confirm).not.toBeUndefined()
  })

  it('should create Prompt and Confirm successfully when "config" is not empty!', () => {
    const mockConfig = {
      okText: 'mock Leave',
      cancelText: 'mock Cancel',
      title: 'mock title',
      content: 'mock content'
    }
    const { Prompt, Confirm } = PromptCreator(mockConfig)
    expect(Prompt).not.toBeUndefined()
    expect(Confirm).not.toBeUndefined()
  })
})

describe('PromptCreator Prompt UI render tests!', () => {
  it('should render successfully!', () => {
    const mockText = 'mock text'
    const { Prompt } = PromptCreator({})
    const element = (
      <BrowserRouter>
        <Prompt>{mockText}</Prompt>
      </BrowserRouter>
    )
    const { getByText } = render(element)
    expect(getByText(mockText)).toBeInTheDocument()
  })

  it('should show confirm when "when" is true!', async () => {
    const mockLeaveText = 'mock leave'
    const mockConfig = {
      title: 'mock title',
      content: 'mock content',
      okText: 'mock ok text',
      cancelText: 'mock cancel text'
    }

    const mockConfirm = jest.spyOn(window, 'confirm').mockImplementation()

    const { Prompt } = PromptCreator(mockConfig)
    const element = (
      <BrowserRouter>
        <Prompt when={true} />
        <Link to='/mock'>{mockLeaveText}</Link>
      </BrowserRouter>
    )
    const { getByText } = render(element)
    fireEvent.click(getByText(mockLeaveText))

    expect(mockConfirm).toHaveBeenCalledTimes(1)
    expect(mockConfirm).toHaveBeenNthCalledWith(1, JSON.stringify(mockConfig))
  })
})
