import * as React from 'react'
import { render } from '@testing-library/react'
import NotFound from '../notFound'

describe('notFound render UI result', () => {
  it('should return 404 Result when resource is undefined', () => {
    const Component = () => <div>hello world!</div>
    const resource = undefined

    const NotFoundElement = NotFound(Component, resource)
    const { container } = render(<NotFoundElement />)

    expect(container).toMatchSnapshot()
  })

  it('should return DecoratedComponent when resource is not undefined', () => {
    const Component = () => <div>hello world!</div>
    const resource = { name: '123' }

    const NotFoundElement = NotFound(Component, resource)
    const { container } = render(<NotFoundElement />)

    expect(container).toMatchSnapshot()
  })
})
