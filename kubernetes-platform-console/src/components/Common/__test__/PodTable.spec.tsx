import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import PodTable from 'components/Common/PodTable'
import { POD_TABLE_CONTEXT } from 'constants/common'
import '@testing-library/jest-dom/extend-expect'

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

const baseListPodsState = {
  value: {
    pods: [
      {
        name: 'auth-auth-test-sg-green-bfd5dffb4-lc7f2',
        nodeName: 'devops-kube-test-node1',
        clusterId: 'test-sg:test',
        projectName: 'auth',
        appName: 'auth-auth',
        groupName: 'Infrastructure',
        namespace: 'auth-test-sg',
        cid: 'sg',
        environment: 'test',
        nodeIP: '10.129.103.67',
        podIP: '100.89.195.30',
        status: 'CrashLoopBackOff',
        creationTimestamp: '2022-02-18T10:13:53Z',
        containers: [
          {
            image: 'harbor.shopeemobile.com/shopee/auth-auth-live-sg:2f21f44eaca9',
            name: 'auth-auth-test-sg',
            tag: '2f21f44eaca9'
          }
        ],
        restart: {
          restartCount: 17348,
          lastRestartTime: '2022-04-27T06:20:21Z'
        },
        cpu: {
          used: 0.00884560116666,
          applied: 1,
          Ready: true
        },
        memory: {
          used: 241901567.99999866,
          applied: 1073741824,
          Ready: true
        }
      }
    ],
    statusList: [['Running', 'ImagePullBackOff', 'Init:CrashLoopBackOff', 'CrashLoopBackOff']],
    totalCount: 1
  },
  loading: false
}
const useAntdTableResult = { pagination: {}, handleTableChange: jest.fn, refresh: jest.fn }

describe('Pod table render UI result', () => {
  it('should display correct phase column based on props', () => {
    const listPodsState = {
      value: {
        pods: [],
        statusList: [],
        totalCount: 0
      },
      loading: false
    }
    render(
      <PodTable
        showActions={false}
        showPhase={false}
        listPodsState={listPodsState}
        useAntdTableResult={useAntdTableResult}
        contextType={POD_TABLE_CONTEXT.NODE}
      />
    )
    expect(document.querySelectorAll('.ant-table-thead > tr > .ant-table-cell').length).toBe(6)
    expect(document.querySelector('.ant-table-thead')).not.toHaveTextContent('Phase')
    expect(document.querySelector('.ant-table-thead')).not.toHaveTextContent('Action')
  })

  it('should display correct phase column based on props', () => {
    const listPodsState = {
      value: {
        pods: [],
        statusList: [],
        totalCount: 0
      },
      loading: false
    }
    render(
      <PodTable
        showActions={true}
        showPhase={true}
        listPodsState={listPodsState}
        useAntdTableResult={useAntdTableResult}
        contextType={POD_TABLE_CONTEXT.NODE}
      />
    )
    expect(document.querySelectorAll('.ant-table-thead > tr > .ant-table-cell').length).toBe(8)
    expect(screen.getByText('Phase')).toBeVisible()
    expect(screen.getByText('Action')).toBeVisible()
  })
})

describe('Pod table permission result', () => {
  it('should display correct clickable buttons based on permission', async () => {
    const listPodsStateWithTraceId = JSON.parse(JSON.stringify(baseListPodsState))
    const podWithTraceId = { ...listPodsStateWithTraceId.value.pods[0], ...{ traceId: 'dddd' } }
    listPodsStateWithTraceId.value.pods[0] = podWithTraceId
    render(
      <PodTable
        hasKillPodPermission={true}
        showActions={true}
        showPhase={false}
        listPodsState={listPodsStateWithTraceId}
        useAntdTableResult={useAntdTableResult}
        contextType={POD_TABLE_CONTEXT.DEPLOYMENT}
      />
    )
    fireEvent.mouseEnter(screen.getByText('More'))
    await waitFor(() => screen.getByText('Log'))
    await waitFor(() => screen.getByText('Tracing'))
    await waitFor(() => screen.getByText('Profiling'))
    await waitFor(() => screen.getByText('Kill'))
    expect(screen.getByText('Log').parentElement).not.toHaveAttribute('disabled')
    expect(screen.getByText('Tracing').parentElement).not.toHaveAttribute('disabled')
    expect(screen.getByText('Profiling').parentElement).not.toHaveAttribute('disabled')
    expect(screen.getByText('Kill').parentElement).not.toHaveAttribute('disabled')
  })

  it('should display correct unclickable buttons based on permission', async () => {
    render(
      <PodTable
        showActions={true}
        showPhase={false}
        listPodsState={baseListPodsState}
        useAntdTableResult={useAntdTableResult}
        contextType={POD_TABLE_CONTEXT.NODE}
      />
    )
    fireEvent.mouseEnter(screen.getByText('More'))
    await waitFor(() => screen.getByText('Log'))
    await waitFor(() => screen.getByText('Tracing'))
    await waitFor(() => screen.getByText('Profiling'))
    await waitFor(() => screen.getByText('Kill'))
    expect(screen.getByText('Log').parentElement).toHaveAttribute('disabled')
    expect(screen.getByText('Tracing').parentElement).toHaveAttribute('disabled')
    expect(screen.getByText('Profiling').parentElement).not.toHaveAttribute('disabled')
    expect(screen.getByText('Kill').parentElement).toHaveAttribute('disabled')
  })
})
