import { renderHook, RenderHookResult } from '@testing-library/react-hooks'

import useDeepEqualEffect from '../useDeepEqualEffect'

let fn: jest.Mock<any> = null
let hook: RenderHookResult<any, any> = null

describe('fn', () => {
  it('should be invoked when it call useDeepEqualEffect for the first time', () => {
    const comparators = []
    fn = jest.fn()
    hook = renderHook(() => useDeepEqualEffect(fn, comparators))

    expect(fn.mock.calls.length).toEqual(1)
  })
})

describe('comparators', () => {
  it('should be invoked when comparators is not equal', () => {
    let comparators = []
    fn = jest.fn()
    hook = renderHook(() => useDeepEqualEffect(fn, comparators))

    comparators = ['']

    const { rerender } = hook

    rerender()

    expect(fn.mock.calls.length).toEqual(2)
  })

  it('should not be invoked when comparators is equal', () => {
    const comparators = []
    fn = jest.fn()
    hook = renderHook(() => useDeepEqualEffect(fn, comparators))

    const { rerender } = hook

    rerender()

    expect(fn.mock.calls.length).toEqual(1)
  })
})
