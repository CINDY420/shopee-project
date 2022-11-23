import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ChartCollapse from 'components/Common/ChartCollapse'
import '@testing-library/jest-dom/extend-expect'
const mockPanel = <div id='mockItem'>Mock List Item</div>

describe('ChartCollaspe render UI result', () => {
  it('should display chart correctly', async () => {
    render(<ChartCollapse panel={mockPanel} />)

    expect(screen.queryByText('Show Resource Charts')).toBeTruthy()
    expect(document.getElementById('mockItem')).not.toBeTruthy()
    expect(document.getElementsByClassName('ant-collapse-content').length).toBe(0)

    fireEvent.click(document.getElementsByClassName('ant-collapse-header')[0])
    expect(screen.queryByText('Show Resource Charts')).not.toBeTruthy()
    expect(document.getElementById('mockItem')).toBeTruthy()
    expect(document.getElementsByClassName('ant-collapse-content')[0]).toHaveClass('ant-collapse-content-active')

    fireEvent.click(document.getElementsByClassName('ant-collapse-header')[0])
    expect(screen.queryByText('Show Resource Charts')).toBeTruthy()
    expect(document.getElementById('mockItem')).toBeTruthy()
    expect(document.getElementsByClassName('ant-collapse-content')[0]).toHaveClass('ant-collapse-content-hidden')
    expect(document.getElementsByClassName('ant-collapse-content')[0]).toHaveClass('ant-collapse-content-inactive')
  })
})
