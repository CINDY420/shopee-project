import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import DetailLayout, { IDetailLayoutProps } from 'components/Common/DetailLayout'
import '@testing-library/jest-dom/extend-expect'
import { IOrder } from 'infra-design-icons'
import { QueryParamProvider } from 'use-query-params'
import { Button } from 'infrad'

const { ResizeObserver } = window

beforeEach(() => {
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn()
  }))
})

afterEach(() => {
  window.ResizeObserver = ResizeObserver
  jest.restoreAllMocks()
})

const mockTitle = 'Test Title'
const mockTags = ['tag1', 'tag2']
const mockTabs: IDetailLayoutProps['tabs'] = [
  {
    name: 'tab1',
    Component: () => <div id='tab1Component'>tab1 component</div>,
    props: {}
  },
  {
    name: 'tab2',
    Component: () => <div id='tab2Component'>tab2 component</div>,
    props: {}
  }
]
const mockDefaultActiveKey = mockTabs[0].name

const mockButtonFn = jest.fn()

const mockButtons = [
  {
    icon: <IOrder />,
    text: 'Button1',
    click: mockButtonFn
  },
  {
    icon: <IOrder />,
    text: 'Button2',
    disabled: true,
    click: mockButtonFn
  }
]

const mockCustomButton = () => (
  <Button type='link' onClick={mockButtonFn}>
    customButton
  </Button>
)

const mockBody = <div id='detailBody'>detail layout body</div>
const mockPodState = 'running'

describe('DetailLayout render UI result', () => {
  it('should display correctly with tabs prop', () => {
    render(
      <QueryParamProvider>
        <DetailLayout
          title={mockTitle}
          tags={mockTags}
          defaultActiveKey={mockDefaultActiveKey}
          tabs={mockTabs}
          buttons={mockButtons}
          CustomButton={mockCustomButton}
          body={mockBody}
          isHeaderWithBottomLine={false}
        />
      </QueryParamProvider>
    )

    expect(screen.getByText(mockTitle).textContent).toEqual(mockTitle)

    expect(screen.getByText(mockTags[0]).textContent).toEqual(mockTags[0])
    expect(screen.getByText(mockTags[1]).textContent).toEqual(mockTags[1])

    expect(screen.getByText(mockTabs[0].name).textContent).toEqual(mockTabs[0].name)
    expect(screen.getByText(mockTabs[1].name).textContent).toEqual(mockTabs[1].name)
    expect(screen.getByText(mockDefaultActiveKey).parentNode).toHaveClass('ant-tabs-tab-active')
    expect(document.getElementById('tab1Component').textContent).toEqual('tab1 component')

    expect(screen.getByText('Button1').textContent).toEqual(' Button1')
    fireEvent.click(screen.getByText('Button1'))
    expect(mockButtonFn).toBeCalled()

    expect(screen.getByText('customButton')).toBeTruthy()
    fireEvent.click(screen.getByText('customButton'))
    expect(mockButtonFn).toBeCalled()

    expect(document.getElementById('detailBody').textContent).toEqual('detail layout body')
  })

  it('should display correctly for pod detail page with state prop', () => {
    render(
      <DetailLayout
        title={mockTitle}
        tags={mockTags}
        state={mockPodState}
        isHeaderWithBottomLine={true}
        buttons={mockButtons}
        body={mockBody}
      />
    )
    expect(screen.getByText(`[${mockPodState}]`)).toBeTruthy()
    expect(screen.getByText(mockTitle)).toBeTruthy()
  })
})
