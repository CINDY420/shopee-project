import { Form } from 'infrad'
import { renderHook, RenderHookResult, act } from '@testing-library/react-hooks'

import { IAsyncState, AsyncFn, useFormStatus } from '../useFormStatus'

let hook: RenderHookResult<IAsyncState, AsyncFn> = null

// mocking dependencies
let validateFieldsMock: jest.SpyInstance = null

const changedFields = [
  {
    name: 'test',
    touched: false,
    validating: false,
    errors: [],
    value: ''
  }
]

const allFields = [
  {
    name: 'test',
    touched: false,
    validating: false,
    errors: [],
    value: 'test'
  },
  {
    name: 'test1',
    touched: false,
    validating: false,
    errors: [],
    value: 'test1'
  },
  {
    name: 'test2',
    touched: false,
    validating: false,
    errors: [],
    value: 'test2'
  }
]

const errorInfo = {
  values: {
    test: 'test',
    test1: 'test1',
    test2: 'test2'
  },
  errorFields: [
    { name: ['test'], errors: ['Please input'] },
    { name: ['test1'], errors: ['Please input'] },
    { name: ['test2'], errors: ['Please input'] }
  ],
  outOfDate: false
}

beforeEach(() => {
  hook = renderHook(() => {
    const [form] = Form.useForm()

    validateFieldsMock = jest.spyOn(form, 'validateFields')

    return useFormStatus(form)
  })
})

afterEach(() => {
  hook = null

  // dependencies un-mock
  validateFieldsMock.mockRestore()
})

describe('getFormStatus', () => {
  it('getFormStatus is called multiple times, validateFields is executed once', async () => {
    const { result } = hook
    const [, getFormStatus] = result.current

    await act(async () => {
      getFormStatus(changedFields, allFields)
      getFormStatus(changedFields, allFields)
    })

    expect(validateFieldsMock).toHaveBeenCalledTimes(1)
  })

  it('validateFields is executed twice when allFields changes', async () => {
    const { result } = hook
    const [, getFormStatus] = result.current

    await act(async () => {
      await getFormStatus(changedFields, allFields)
    })

    await act(async () => {
      await getFormStatus(changedFields, changedFields)
    })

    expect(validateFieldsMock).toHaveBeenCalledTimes(2)
  })

  it('status is true when validateFields return resolve', async () => {
    const { result } = hook
    const [, getFormStatus] = result.current

    validateFieldsMock.mockResolvedValue({})

    await act(async () => {
      await getFormStatus(changedFields, allFields)
    })

    const [state] = result.current

    expect(state.status).toEqual(true)
  })

  it('status is false when validateFields return rejected', async () => {
    const { result } = hook
    const [, getFormStatus] = result.current

    validateFieldsMock.mockRejectedValueOnce(errorInfo)

    await act(async () => {
      await getFormStatus(changedFields, allFields)
    })

    const [state] = result.current

    expect(state.status).toEqual(false)
  })

  it('status is true when errorFields is empty', async () => {
    const { result } = hook
    const [, getFormStatus] = result.current
    const currentErrorInfo = { ...errorInfo }

    currentErrorInfo.errorFields = []

    validateFieldsMock.mockRejectedValueOnce(currentErrorInfo)

    await act(async () => {
      await getFormStatus(changedFields, allFields)
    })

    const [state] = result.current

    expect(state.status).toEqual(true)
  })
})
