import React from 'react'
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import Editor from 'components/Common/Editor'

const value = JSON.stringify({ name: 'test' })

test('render editor', () => {
  const { container } = render(<Editor mode='json' value={value} />)

  expect(container).toMatchSnapshot()
})
