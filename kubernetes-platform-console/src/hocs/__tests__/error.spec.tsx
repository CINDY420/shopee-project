import * as React from 'react'
import { render } from '@testing-library/react'
import Error from '../error'

expect.extend({
  toBeInTheDocument: received => {
    if (!(received instanceof HTMLElement)) {
      return {
        message: () => `expected ${received} to be not a HTMLElement`,
        pass: false
      }
    } else {
      const pass = document.documentElement.contains(received)

      if (pass) {
        return {
          message: () => `expected ${received} to be in documentElement`,
          pass: true
        }
      } else {
        return {
          message: () => `expected ${received} not to be in documentElement`,
          pass: false
        }
      }
    }
  }
})

describe('Error render UI result', () => {
  it('error code is equal to 403', () => {
    const error = { code: 403 }
    const ErrorElement = Error(() => <div />, undefined, error)
    const { container, getByText } = render(<ErrorElement />)

    expect(getByText('You don\'t have permission to view this page')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('error code is equal to 404', () => {
    const error = { code: 404 }
    const ErrorElement = Error(() => <div />, undefined, error)
    const { container, getByText } = render(<ErrorElement />)

    expect(getByText('The resource you visited doesn\'t exist')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('error code is equal to 503', () => {
    const error = { code: 503, message: 'server unavailable' }
    const ErrorElement = Error(() => <div />, undefined, error)
    const { container, getByText } = render(<ErrorElement />)

    expect(getByText('server unavailable')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('resource is undefined', () => {
    const ErrorElement = Error(() => <div />, undefined, null)
    const { container, getByText } = render(<ErrorElement />)

    expect(getByText('The resource you visited doesn\'t exist')).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })

  it('resource is exist', () => {
    const resource = {
      text: 'hongxiang'
    }
    const ErrorElement = Error(() => <div>{resource.text}</div>, resource, null)
    const { container, getByText } = render(<ErrorElement />)

    expect(getByText(resource.text)).toBeInTheDocument()
    expect(container).toMatchSnapshot()
  })
})
