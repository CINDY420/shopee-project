import React from 'react'

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import CrudDrawer from '../CrudDrawer'

const title = 'Test Title'

describe('visible test', () => {
  test('close drawer', () => {
    render(
      <CrudDrawer
        visible={false}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
      />
    )

    expect(document.getElementById('test')).toEqual(null)
  })

  test('open drawer', () => {
    render(
      <CrudDrawer
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
      />
    )

    expect(document.getElementById('test')).toBeVisible()
  })
})

describe('isSubmitDisabled test', () => {
  test('submit disabled', () => {
    render(
      <CrudDrawer
        visible={true}
        isSubmitDisabled={true}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
      />
    )

    const submitBtn = screen.getByText('Submit').parentElement

    expect(submitBtn).toBeDisabled()
  })

  test('submit enabled', () => {
    render(
      <CrudDrawer
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
      />
    )

    const submitBtn = screen.getByText('Submit').parentElement

    expect(submitBtn).not.toBeDisabled()
  })
})

test('title test', () => {
  render(
    <CrudDrawer
      visible={true}
      isSubmitDisabled={false}
      closeDrawer={jest.fn()}
      title={title}
      body={<div id='test' />}
      onSubmit={jest.fn()}
    />
  )

  expect(screen.getByText(title)).toBeVisible()
})

test('width test', () => {
  render(
    <CrudDrawer
      width={520}
      visible={true}
      isSubmitDisabled={false}
      closeDrawer={jest.fn()}
      title={title}
      body={<div id='test' />}
      onSubmit={jest.fn()}
    />
  )

  const drawer = document.getElementsByClassName('ant-drawer-content-wrapper')[0]

  expect(drawer).toHaveStyle({ width: '520px' })
})

describe('pass in fucntions test', () => {
  test('closeDrawer test', () => {
    const handleClose = jest.fn()
    render(
      <CrudDrawer
        width={520}
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={handleClose}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
      />
    )

    const closeBtn = document.getElementsByClassName('ant-drawer-close')[0]

    fireEvent.click(closeBtn)

    expect(handleClose.mock.calls.length).toEqual(1)
  })

  test('onCancel test', () => {
    const handleCancel = jest.fn()
    render(
      <CrudDrawer
        width={520}
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
        onCancel={handleCancel}
      />
    )

    const cancelBtn = screen.getByText('Cancel')

    fireEvent.click(cancelBtn)

    expect(handleCancel.mock.calls.length).toEqual(1)
  })

  test('null onCancel test', () => {
    const handleCancel = jest.fn()
    render(
      <CrudDrawer
        width={520}
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={jest.fn()}
        onCancel={null}
      />
    )

    const cancelBtn = screen.getByText('Cancel')

    fireEvent.click(cancelBtn)

    expect(handleCancel.mock.calls.length).toEqual(0)
  })

  test('onSubmit test', () => {
    const handleSubmit = jest.fn()
    render(
      <CrudDrawer
        width={520}
        visible={true}
        isSubmitDisabled={false}
        closeDrawer={jest.fn()}
        title={title}
        body={<div id='test' />}
        onSubmit={handleSubmit}
      />
    )

    const submitBtn = screen.getByText('Submit')

    fireEvent.click(submitBtn)

    expect(handleSubmit.mock.calls.length).toEqual(1)
  })
})
