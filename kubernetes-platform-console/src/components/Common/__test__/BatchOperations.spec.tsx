import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import BatchOperations from 'components/Common/BatchOperations'

const title = 'Test Title'
const body = document.querySelector('body')

test('parent node test', () => {
  const { container } = render(
    <BatchOperations title={title} selectedCount={1} onSubmit={jest.fn()} onCancel={jest.fn()} parent={body} />
  )

  expect(container.parentNode).toEqual(body)
})

describe('display test', () => {
  test('title test', () => {
    render(<BatchOperations title={title} selectedCount={1} onSubmit={jest.fn()} onCancel={jest.fn()} parent={body} />)

    expect(screen.getByText(title)).toBeVisible()
  })

  test('desc test', () => {
    const desc = 'Test desc'

    render(
      <BatchOperations
        title={title}
        desc={desc}
        selectedCount={1}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        parent={body}
      />
    )

    expect(screen.getByText(desc)).toBeVisible()
  })
})

describe('visible test', () => {
  test('show BatchOperations', () => {
    render(
      <BatchOperations
        visible={true}
        title={title}
        selectedCount={1}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        parent={body}
      />
    )

    expect(screen.getByText(title).parentElement).toHaveStyle({ height: '80px' })
  })

  test('hide BatchOperations', () => {
    render(
      <BatchOperations
        visible={false}
        title={title}
        selectedCount={1}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        parent={body}
      />
    )

    expect(screen.getByText(title).parentElement).toHaveStyle({ height: 0 })
  })
})

describe('is submit disabled test', () => {
  test('submit enable', () => {
    const { baseElement } = render(
      <BatchOperations
        title={title}
        selectedCount={1}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        disabled={false}
        parent={body}
      />
    )

    const submitButton = baseElement.getElementsByClassName('ant-btn-primary')
    expect(submitButton[0]).toBeEnabled()
  })

  test('submit disabled', () => {
    const { baseElement } = render(
      <BatchOperations
        title={title}
        selectedCount={1}
        onSubmit={jest.fn()}
        onCancel={jest.fn()}
        disabled={true}
        parent={body}
      />
    )

    const submitButton = baseElement.getElementsByClassName('ant-btn-primary')
    expect(submitButton[0]).toBeDisabled()
  })
})

describe('handler test', () => {
  test('onSubmit test', () => {
    const onSubmit = jest.fn()

    const { baseElement } = render(
      <BatchOperations title={title} selectedCount={1} onSubmit={onSubmit} onCancel={jest.fn()} parent={body} />
    )

    const submitButton = baseElement.getElementsByClassName('ant-btn-primary')
    fireEvent.click(submitButton[0])
    expect(onSubmit).toBeCalled()
    expect(onSubmit).toBeCalledTimes(1)
  })

  test('onCancel test', () => {
    const onCancel = jest.fn()

    const { baseElement } = render(
      <BatchOperations title={title} selectedCount={1} onSubmit={jest.fn()} onCancel={onCancel} parent={body} />
    )

    const cancelButton = baseElement.getElementsByClassName('ant-btn-default')
    fireEvent.click(cancelButton[0])
    expect(onCancel).toBeCalled()
    expect(onCancel).toBeCalledTimes(1)
  })
})

test('selected count test', () => {
  const { getByText } = render(
    <BatchOperations title={title} selectedCount={2} onSubmit={jest.fn()} onCancel={jest.fn()} parent={body} />
  )

  const textContentMatcher = (text: string) => {
    return (_, node: Element) => {
      const hasText = (node: Element) => node.textContent === text
      const nodeHasText = hasText(node)
      const childrenDontHaveText = Array.from(node?.children || []).every(child => !hasText(child))
      return nodeHasText && childrenDontHaveText
    }
  }

  expect(getByText(textContentMatcher('Selected 2 items'))).toBeTruthy()
})

test('render buttons', () => {
  const renderButtons = () => (
    <div className='render-buttons'>
      <button>test</button>
      <button>another test</button>
    </div>
  )

  const { baseElement } = render(
    <BatchOperations
      title={title}
      selectedCount={1}
      onSubmit={jest.fn()}
      onCancel={jest.fn()}
      renderButtons={renderButtons}
      parent={body}
    />
  )

  const expectElements = baseElement.getElementsByClassName('render-buttons')
  expect(expectElements.length).toBe(1)
})
