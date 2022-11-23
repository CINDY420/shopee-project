import * as React from 'react'
import { render, screen } from '@testing-library/react'
import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import { AsyncStatus } from 'hooks/useRecoil'
import { BrowserRouter } from 'react-router-dom'
import { HTTPError } from 'helpers/fetch'

const mockComponent = () => <div>mock component</div>

describe('AsyncRoute render UI result', () => {
  it('should display loading when asyncState.status equals to AsyncStatus.INITIAL', () => {
    const mockRoute: IAsyncRouteProps = {
      path: '/',
      LazyComponent: mockComponent,
      asyncState: {
        status: AsyncStatus.INITIAL,
        value: 'mock value'
      }
    }

    render(
      <BrowserRouter>
        <AsyncRoute {...mockRoute} />
      </BrowserRouter>
    )

    const spin = document.getElementsByClassName('ant-spin-spinning')
    expect(spin.length).toBe(1)
  })

  it('should display loading when asyncState.status equals to AsyncStatus.ONGOING', () => {
    const mockRoute: IAsyncRouteProps = {
      path: '/',
      LazyComponent: mockComponent,
      asyncState: {
        status: AsyncStatus.ONGOING,
        value: 'mock value'
      }
    }

    render(
      <BrowserRouter>
        <AsyncRoute {...mockRoute} />
      </BrowserRouter>
    )

    const spin = document.getElementsByClassName('ant-spin-spinning')
    expect(spin.length).toBe(1)
  })

  it('should display component when asyncState.status equals to AsyncStatus.FINISHED', () => {
    const mockRoute: IAsyncRouteProps = {
      path: '/',
      LazyComponent: mockComponent,
      asyncState: {
        status: AsyncStatus.FINISHED,
        value: 'mock value'
      }
    }

    render(
      <BrowserRouter>
        <AsyncRoute {...mockRoute} />
      </BrowserRouter>
    )

    const contentDiv = screen.getByText('mock component')
    expect(contentDiv).toBeTruthy()
  })

  it('should display not found page when asyncState.value is undefined', () => {
    const mockRoute: IAsyncRouteProps = {
      path: '/',
      LazyComponent: mockComponent,
      asyncState: {
        status: AsyncStatus.FINISHED
      }
    }

    render(
      <BrowserRouter>
        <AsyncRoute {...mockRoute} />
      </BrowserRouter>
    )

    const contentDiv = screen.getByText("The resource you visited doesn't exist")
    expect(contentDiv).toBeTruthy()
  })

  it('should display  not found page when asyncState.error is not undefined', () => {
    const mockRoute: IAsyncRouteProps = {
      path: '/',
      LazyComponent: mockComponent,
      asyncState: {
        status: AsyncStatus.FINISHED,
        value: 'mock data',
        error: new HTTPError('', 404, '')
      }
    }

    render(
      <BrowserRouter>
        <AsyncRoute {...mockRoute} />
      </BrowserRouter>
    )

    const contentDiv = screen.getByText("The resource you visited doesn't exist")
    expect(contentDiv).toBeTruthy()
  })
})
