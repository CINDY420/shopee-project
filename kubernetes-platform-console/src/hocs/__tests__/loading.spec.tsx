import * as React from 'react'
import { render } from '@testing-library/react'
import Loading from '../loading'

describe('Loading render UI result', () => {
  it('should return StyledSpin when loading is true', () => {
    const text = 'loading is true'
    const LoadingElement = Loading(() => <div>{text}</div>, true)
    const { container } = render(<LoadingElement />)

    expect(container).toMatchSnapshot()
  })

  it('should return DecoratedComponent when loading is false', () => {
    const text = 'loading is false'
    const LoadingElement = Loading(() => <div>{text}</div>, false)
    const { container } = render(<LoadingElement />)

    expect(container).toMatchSnapshot()
  })
})
