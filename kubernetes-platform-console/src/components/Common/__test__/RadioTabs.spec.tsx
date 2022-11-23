import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { RadiosTabs, RadiosTabPane } from '../RadiosTabs'

const mockData = [
  { name: 'tab1', content: 'mock content 1' },
  { name: 'tab2', content: 'mock content 2' },
  { name: 'tab3', content: 'mock content 3' }
]

describe('RadioTabs render UI result', () => {
  it('should display radio buttons according to RadiosTabPane list', () => {
    render(
      <RadiosTabs>
        {mockData.map(item => {
          const { name } = item
          return <RadiosTabPane key={name} value={name} name='tab' />
        })}
      </RadiosTabs>
    )

    expect(screen.getAllByText('tab').length).toBe(3)
  })

  it('should not selected when first render if activeKey not specified', () => {
    const CONTENT = 'mock content'

    render(
      <RadiosTabs>
        <RadiosTabPane key='tab' value='tab' name='tab'>
          {CONTENT}
        </RadiosTabPane>
      </RadiosTabs>
    )

    expect(screen.getByText('tab')).toBeTruthy()
    expect(screen.getByText(CONTENT)).toBeTruthy()

    const contentDiv = screen.getByText(CONTENT)
    const style = window.getComputedStyle(contentDiv)
    expect(style.height).toBe('0px')
  })

  it('should selected when first render if activeKey specified', () => {
    const CONTENT = 'mock content'

    render(
      <RadiosTabs activeKey='tab'>
        <RadiosTabPane key='tab' value='tab' name='tab'>
          {CONTENT}
        </RadiosTabPane>
      </RadiosTabs>
    )

    expect(screen.getByText('tab')).toBeTruthy()
    expect(screen.getByText(CONTENT)).toBeTruthy()

    const contentDiv = screen.getByText(CONTENT)
    const style = window.getComputedStyle(contentDiv)
    expect(style.height).not.toBe('0px')
  })
})

describe('RadioTabs behavior', () => {
  it('should switch content when tab click', () => {
    render(
      <RadiosTabs>
        {mockData.map(item => {
          const { name, content } = item
          return (
            <RadiosTabPane key={name} value={name} name={name}>
              {content}
            </RadiosTabPane>
          )
        })}
      </RadiosTabs>
    )

    mockData.forEach(item => {
      const { name, content } = item
      const tab = screen.getByText(name)
      fireEvent.click(tab)

      const contentDiv = screen.getByText(content)
      const style = window.getComputedStyle(contentDiv)
      expect(style.height).not.toBe('0px')
    })
  })
})
