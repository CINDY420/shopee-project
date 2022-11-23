import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import FoldableList from '../FoldableList'

const MockListItem = () => {
  return (
    <>
      <div>Mock List Item</div>
    </>
  )
}

describe('FoldableList render UI result', () => {
  it('should display list item according to renderItem component', () => {
    const mockData = [{}]
    render(<FoldableList renderItem={MockListItem} dataSource={mockData} />)

    expect(screen.getByText('Mock List Item')).toBeTruthy()
  })

  it("the number of items is displayed by default should according to param fold's property: `rows` ", () => {
    const mockData = [{}, {}, {}, {}]

    render(<FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3 }} />)

    expect(screen.getAllByText('Mock List Item').length).toBe(3)
  })

  it('should display `More` button when the list is collapsed', () => {
    const mockData = [{}, {}, {}, {}]

    render(<FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3 }} />)

    expect(screen.getAllByText('Mock List Item').length).toBe(3)
    expect(screen.getByText('More')).toBeTruthy()
  })

  it("should display custom `show more` button when user specify it by param fold's property: `expandSymbol`", () => {
    const mockData = [{}, {}, {}, {}]

    render(<FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3, expandSymbol: 'Expand' }} />)

    expect(screen.getAllByText('Mock List Item').length).toBe(3)
    expect(screen.getByText('Expand')).toBeTruthy()
  })
})

describe('FoldableList behavior', () => {
  it('should display all items when user click the expand button', async () => {
    const mockData = [{}, {}, {}, {}]

    const { getByText, getAllByText } = render(
      <FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3 }} />
    )

    expect(getAllByText('Mock List Item').length).toBe(3)
    expect(getByText('More')).toBeTruthy()

    const expandButton = getByText('More')

    fireEvent.click(expandButton)

    await waitFor(() => expect(getAllByText('Mock List Item').length).toBe(4))
  })

  it('should display the collapse button when the list is expanded', () => {
    const mockData = [{}, {}, {}, {}]

    render(<FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3 }} />)

    const expandButton = screen.getByText('More')

    fireEvent.click(expandButton)

    expect(screen.getByText('Collapse')).toBeTruthy()
  })

  it('should collapsed when user click the collapse button', async () => {
    const mockData = [{}, {}, {}, {}]

    const { getByText, getAllByText } = render(
      <FoldableList renderItem={MockListItem} dataSource={mockData} fold={{ rows: 3 }} />
    )

    const expandButton = getByText('More')

    fireEvent.click(expandButton)

    await waitFor(() => expect(getAllByText('Mock List Item').length).toBe(4))

    const collapseButton = getByText('Collapse')

    expect(collapseButton).toBeTruthy()

    fireEvent.click(collapseButton)

    await waitFor(() => expect(getAllByText('Mock List Item').length).toBe(3))
  })
})
