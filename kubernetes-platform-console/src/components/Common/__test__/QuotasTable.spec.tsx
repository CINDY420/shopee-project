import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import QuotasTable from 'components/Common/QuotasTable'
import '@testing-library/jest-dom/extend-expect'
import { AccessControlContext } from 'hooks/useAccessControl'
import { act } from 'react-dom/test-utils'

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn()
    }))
  })
})

const mockGroup = {
  name: '1005',
  alias: 'Infrastructure Team',
  resourceQuotas: [
    {
      envName: 'LIVE',
      name: '1005-LIVE',
      cpu: {
        used: 0,
        assigned: 0,
        limit: 0,
        total: 0
      },
      memory: {
        used: 0,
        assigned: 0,
        limit: 2.5633163,
        total: 0
      }
    }
  ]
}
const mockContextValue = {
  ClusterQuota: ['View', 'Edit'],
  Cluster: ['Add', 'View', 'Edit', 'Unbind']
}

describe('Pod table render UI result', () => {
  it('should display correct phase column based on props', () => {
    render(
      <QuotasTable
        key='test'
        quotaData={mockGroup}
        onUpdateQuotas={jest.fn()}
        isUpdating={false}
        onSaveCallback={jest.fn()}
        type='cluster'
      />
    )
    expect(document.querySelectorAll('.ant-table-thead > tr > .ant-table-cell').length).toBe(9)
    expect(document.querySelectorAll('.ant-table-tbody > tr').length).toBe(1)
    expect(screen.queryByText('Quota Manage')).toBeTruthy()
  })
})

describe('Buttons behaviour', () => {
  it('should behave correctly', async () => {
    render(
      <AccessControlContext.Provider value={mockContextValue}>
        <QuotasTable
          key='test'
          quotaData={mockGroup}
          onUpdateQuotas={jest.fn()}
          isUpdating={false}
          onSaveCallback={jest.fn()}
          type='cluster'
        />
      </AccessControlContext.Provider>
    )

    expect(screen.queryByText('Quota Manage')).toBeTruthy()
    expect(screen.queryByText('Save')).not.toBeTruthy()
    expect(screen.queryByText('Cancel')).not.toBeTruthy()

    fireEvent.click(screen.queryByText('Quota Manage'))
    expect(screen.queryByText('Quota Manage')).not.toBeTruthy()
    expect(screen.queryByText('Save')).toBeTruthy()
    expect(screen.queryByText('Cancel')).toBeTruthy()

    fireEvent.click(screen.queryByText('Cancel'))
    expect(screen.queryByText('Quota Manage')).toBeTruthy()
    expect(screen.queryByText('Save')).not.toBeTruthy()
    expect(screen.queryByText('Cancel')).not.toBeTruthy()
  })
})

describe('Submit behaviour', () => {
  it('should submit correctly', async () => {
    render(
      <AccessControlContext.Provider value={mockContextValue}>
        <QuotasTable
          key='test'
          quotaData={mockGroup}
          onUpdateQuotas={jest.fn()}
          isUpdating={false}
          onSaveCallback={jest.fn()}
          type='cluster'
        />
      </AccessControlContext.Provider>
    )
    fireEvent.click(screen.queryByText('Quota Manage'))
    await act(async () => {
      fireEvent.click(screen.queryByText('Save'))
    })
    expect(screen.queryByText('Quota Manage')).toBeTruthy()
    expect(screen.queryByText('Save')).not.toBeTruthy()
    expect(screen.queryByText('Cancel')).not.toBeTruthy()
  })
})
