import * as React from 'react'
import * as handleLocationChange from 'hooks/routes/useLocationChange'
import { render, act, screen, fireEvent } from '@testing-library/react'
import BreadcrumbsBanner, { IBreadcrumbsBannerProps } from '../BreadcrumbsBanner'

describe('BreadcrumbsBanner render UI result', () => {
  it('should display crumb text according to crumbResourceLookup configuration', () => {
    const crumbsLookup: IBreadcrumbsBannerProps['crumbLookup'] = {
      a: {}
    }
    const crumbResourceLookup: IBreadcrumbsBannerProps['crumbResourceLookup'] = {
      a: { name: 'a' }
    }
    const crumbs: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
      {
        route: '/a',
        extendedCrumbs: 'a'
      }
    ]

    const handleLocationChangeMock = jest.spyOn(handleLocationChange, 'default')
    let innerHandleLocationChange = null

    handleLocationChangeMock.mockImplementation(_handleLocationChange => {
      innerHandleLocationChange = _handleLocationChange
    })

    const { container } = render(
      <BreadcrumbsBanner
        crumbLookup={crumbsLookup}
        crumbResourceLookup={crumbResourceLookup}
        routeCrumbsTree={crumbs}
      />
    )
    act(() => {
      innerHandleLocationChange({ pathname: '/a' })
    })

    expect(container).toMatchSnapshot()
  })

  it('should display crumb text with description as prefix according to crumbLookup configuration', () => {
    const crumbsLookup: IBreadcrumbsBannerProps['crumbLookup'] = {
      a: { desc: 'A:' }
    }
    const crumbResourceLookup: IBreadcrumbsBannerProps['crumbResourceLookup'] = {
      a: { name: 'a' }
    }
    const crumbs: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
      {
        route: '/a',
        extendedCrumbs: 'a'
      }
    ]

    const handleLocationChangeMock = jest.spyOn(handleLocationChange, 'default')
    let innerHandleLocationChange = null

    handleLocationChangeMock.mockImplementation(_handleLocationChange => {
      innerHandleLocationChange = _handleLocationChange
    })

    const { container } = render(
      <BreadcrumbsBanner
        crumbLookup={crumbsLookup}
        crumbResourceLookup={crumbResourceLookup}
        routeCrumbsTree={crumbs}
      />
    )
    act(() => {
      innerHandleLocationChange({ pathname: '/a' })
    })

    expect(container).toMatchSnapshot()
  })

  it('should render children crumb according to routeCrumbsTree configuration', () => {
    const crumbsLookup: IBreadcrumbsBannerProps['crumbLookup'] = {
      a: {},
      b: {},
      c: {}
    }
    const crumbResourceLookup: IBreadcrumbsBannerProps['crumbResourceLookup'] = {
      a: { name: 'a' },
      b: { name: 'b' },
      c: { name: 'c' }
    }
    const crumbs: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
      {
        route: '/a',
        extendedCrumbs: 'a',
        children: [
          {
            route: '/a/b',
            extendedCrumbs: 'b',
            children: [
              {
                route: '/a/b/c',
                extendedCrumbs: 'c'
              }
            ]
          }
        ]
      }
    ]

    const handleLocationChangeMock = jest.spyOn(handleLocationChange, 'default')
    let innerHandleLocationChange = null

    handleLocationChangeMock.mockImplementation(_handleLocationChange => {
      innerHandleLocationChange = _handleLocationChange
    })

    const { container } = render(
      <BreadcrumbsBanner
        crumbLookup={crumbsLookup}
        crumbResourceLookup={crumbResourceLookup}
        routeCrumbsTree={crumbs}
      />
    )
    act(() => {
      innerHandleLocationChange({ pathname: '/a/b/c' })
    })

    expect(container).toMatchSnapshot()
  })
})

describe('BreadcrumbsBanner behavior', () => {
  it('last crumb can not be click', () => {
    const crumbClickHandler = jest.fn()
    const crumbsLookup: IBreadcrumbsBannerProps['crumbLookup'] = {
      a: {},
      b: { onClick: crumbClickHandler }
    }
    const crumbResourceLookup: IBreadcrumbsBannerProps['crumbResourceLookup'] = {
      a: { name: 'a' },
      b: { name: 'b' }
    }
    const crumbs: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
      {
        route: '/a',
        extendedCrumbs: 'a',
        children: [
          {
            route: '/a/b',
            extendedCrumbs: 'b'
          }
        ]
      }
    ]

    const handleLocationChangeMock = jest.spyOn(handleLocationChange, 'default')
    let innerHandleLocationChange = null

    handleLocationChangeMock.mockImplementation(_handleLocationChange => {
      innerHandleLocationChange = _handleLocationChange
    })

    render(
      <BreadcrumbsBanner
        crumbLookup={crumbsLookup}
        crumbResourceLookup={crumbResourceLookup}
        routeCrumbsTree={crumbs}
      />
    )
    act(() => {
      innerHandleLocationChange({ pathname: '/a/b' })
    })

    const lastNav = screen.getByText('b')
    fireEvent.click(lastNav)

    expect(crumbClickHandler).toBeCalledTimes(0)
  })

  it('crumb can be click if it is not the last one', () => {
    const crumbClickHandler = jest.fn()
    const crumbsLookup: IBreadcrumbsBannerProps['crumbLookup'] = {
      a: { onClick: crumbClickHandler },
      b: {}
    }
    const crumbResourceLookup: IBreadcrumbsBannerProps['crumbResourceLookup'] = {
      a: { name: 'a' },
      b: { name: 'b' }
    }
    const crumbs: IBreadcrumbsBannerProps['routeCrumbsTree'] = [
      {
        route: '/a',
        extendedCrumbs: 'a',
        children: [
          {
            route: '/a/b',
            extendedCrumbs: 'b'
          }
        ]
      }
    ]

    const handleLocationChangeMock = jest.spyOn(handleLocationChange, 'default')
    let innerHandleLocationChange = null

    handleLocationChangeMock.mockImplementation(_handleLocationChange => {
      innerHandleLocationChange = _handleLocationChange
    })

    render(
      <BreadcrumbsBanner
        crumbLookup={crumbsLookup}
        crumbResourceLookup={crumbResourceLookup}
        routeCrumbsTree={crumbs}
      />
    )
    act(() => {
      innerHandleLocationChange({ pathname: '/a/b' })
    })

    const lastNav = screen.getByText('a')
    fireEvent.click(lastNav)

    expect(crumbClickHandler).toBeCalledTimes(1)
  })
})
