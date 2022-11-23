import { render, screen } from '@testing-library/react'
import { Tag, Typography } from 'infrad'
import CollapsibleSpace from '@/components/CollapsibleSpace'
import userEvent from '@testing-library/user-event'

const mockData = [1, 2, 3, 4, 5, 6]
const mockChild = mockData.map((number) => <Tag key={number}>{number}</Tag>)
const mockChildCount = 4

const mockMoreText = (
  <Typography.Link>
    <span style={{ marginRight: '3px' }}>More Item</span>
  </Typography.Link>
)

const mockCollapseText = (
  <Typography.Link>
    <span style={{ marginRight: '3px' }}>Collapse Item</span>
  </Typography.Link>
)

describe('CollapsibleSpace', () => {
  test('Basic Usage', async () => {
    // Arrange
    const { container, getByText } = render(
      <CollapsibleSpace size={4}>{mockChild}</CollapsibleSpace>,
    )

    const moreText = getByText('More')
    const spaceItemCount = container.getElementsByClassName('ant-space-item').length

    // Act
    await userEvent.click(moreText)
    const spaceItemCountAfterMoreText = container.getElementsByClassName('ant-space-item').length
    const collapseTextAfterMoreText = getByText('Collapse')

    // Assert
    expect(spaceItemCount).toBe(4)
    expect(spaceItemCountAfterMoreText).toBe(mockData.length + 1)
    expect(collapseTextAfterMoreText).toBeInTheDocument()
  })

  test('fixedChildCount prop when children are more than fixed count', () => {
    const { container } = render(
      <CollapsibleSpace size={4} fixedChildCount={mockChildCount}>
        {mockChild}
      </CollapsibleSpace>,
    )
    const spaceItemCount = container.getElementsByClassName('ant-space-item').length
    expect(spaceItemCount).toBe(mockChildCount + 1)
  })

  test('fixedChildCount prop when children are less than fixed count', () => {
    const lessChildren = mockChild.slice(2)
    const { container } = render(
      <CollapsibleSpace size={4} fixedChildCount={mockChildCount}>
        {lessChildren}
      </CollapsibleSpace>,
    )
    const spaceItemCount = container.getElementsByClassName('ant-space-item').length
    expect(spaceItemCount).toBe(lessChildren.length)
  })

  test('collapsed prop', () => {
    const { container, getByText } = render(
      <CollapsibleSpace size={4} collapsed={false}>
        {mockChild}
      </CollapsibleSpace>,
    )
    const collapsesText = getByText('Collapse')
    const spaceItemCount = container.getElementsByClassName('ant-space-item').length

    expect(collapsesText).toBeInTheDocument()
    expect(spaceItemCount).toBe(mockData.length + 1)
  })

  test('moreText prop', () => {
    const { getByText } = render(
      <CollapsibleSpace size={4} moreText={mockMoreText}>
        {mockChild}
      </CollapsibleSpace>,
    )
    const moreText = getByText('More Item')
    expect(moreText).toBeInTheDocument()
  })

  test('collapseText prop', async () => {
    const { getByText } = render(
      <CollapsibleSpace size={4} collapseText={mockCollapseText}>
        {mockChild}
      </CollapsibleSpace>,
    )

    const moreText = getByText('More')
    await userEvent.click(moreText)

    const collapseText = getByText('Collapse Item')
    expect(collapseText).toBeInTheDocument()
  })

  test('onCollapse prop', async () => {
    const mockOnCollapseFn = jest.fn()
    const { getByText } = render(
      <CollapsibleSpace size={4} onCollapse={mockOnCollapseFn}>
        {mockChild}
      </CollapsibleSpace>,
    )

    const moreText = getByText('More')
    await userEvent.click(moreText)

    const collapseText = screen.getByText('Collapse')
    await userEvent.click(collapseText)
    expect(mockOnCollapseFn).toHaveBeenCalledTimes(1)
  })

  test('onExpand prop', async () => {
    const mockOnExpandFn = jest.fn()
    render(
      <CollapsibleSpace size={4} onExpand={mockOnExpandFn}>
        {mockChild}
      </CollapsibleSpace>,
    )

    const moreText = screen.getByText('More')
    await userEvent.click(moreText)
    expect(mockOnExpandFn).toHaveBeenCalledTimes(1)
  })
})
