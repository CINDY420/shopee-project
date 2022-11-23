import { renderHook, RenderHookResult, act } from '@testing-library/react-hooks'
import * as recoil from 'recoil'

import { useRemoteRecoil, AsyncFn, IAsyncState, ASYNC_STATUS } from '../useRecoil'
import * as useMountedState from '../useMountedState'

let fn: jest.Mock<any>
let hook: RenderHookResult<IAsyncState<any>, AsyncFn<unknown>>

// mocking dependencies
let useMountedStateMock: jest.SpyInstance
let useSetRecoilStateMock: jest.SpyInstance

// mock data
const { atom } = recoil
const recoilState: recoil.RecoilState<any> = atom<any>({
  key: 'testObj',
  default: null,
})

beforeEach(() => {
  // dependencies mocking
  useMountedStateMock = jest.spyOn(useMountedState, 'default')
  useSetRecoilStateMock = jest.spyOn(recoil, 'useSetRecoilState')

  useMountedStateMock.mockReturnValue(() => true)
  useSetRecoilStateMock.mockReturnValue((value: any) => value)
})

afterEach(() => {
  fn = jest.fn()
  // dependencies un-mock
  useMountedStateMock.mockRestore()
  useSetRecoilStateMock.mockRestore()
})

describe('fn and state', () => {
  it('fn that is promiss shoulde be invoked', async () => {
    const data = {}
    fn = jest.fn().mockResolvedValueOnce(data)
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(fn).toHaveBeenCalledTimes(1)
    expect(state.status).toBe(ASYNC_STATUS.FINISHED)
  })

  it('fn that is not promiss shoulde return undefined', async () => {
    fn = jest.fn()
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.value).toBeUndefined()
  })

  it('fn that return error shoulde produce error', async () => {
    fn = jest.fn().mockRejectedValueOnce({ message: 'error' })
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.status).toBe(ASYNC_STATUS.ERROR)
    expect(state.error).toBeTruthy()
  })
})

describe('recoilState', () => {
  it('recoilState shoulde be updated when fn is invoked', async () => {
    const data = {
      name: 'hongxiang',
    }
    fn = jest.fn().mockResolvedValueOnce(data)
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.value).toEqual(data)
  })
})

describe('getMounted', () => {
  it('recoilState shoulde be updated when getMounted return true', async () => {
    const data = {
      name: 'hongxiang',
    }
    useMountedStateMock.mockReturnValueOnce(() => true)
    fn = jest.fn().mockResolvedValueOnce(data)
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.value).toEqual(data)
  })

  it('recoilState shoulde not be updated when getMounted return false', async () => {
    const data = {
      name: 'hongxiang',
    }
    useMountedStateMock.mockReturnValueOnce(() => false)
    fn = jest.fn().mockResolvedValueOnce(data)
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.value).toBeUndefined()
  })
})

describe('callback', () => {
  it('multiple calls shoulde abort legacy request when your network is slow', async () => {
    const data1 = {
      name: '1',
    }
    const data2 = {
      name: '2',
    }

    fn = jest
      .fn()
      .mockImplementationOnce(() => {
        const p = new Promise((resolve) => {
          setTimeout(() => resolve(data1), 1000)
        })

        return p
      })
      .mockImplementationOnce(() => {
        const p = new Promise((resolve) => {
          setTimeout(() => resolve(data2), 2000)
        })

        return p
      })
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const { result } = hook
    const [, callback] = result.current

    await act(async () => {
      await callback()
    })

    await act(async () => {
      await callback()
    })

    const [state] = hook.result.current

    expect(state.value).toEqual(data2)
  })
})

describe('clean', () => {
  it('shoulde reset status', () => {
    fn = jest.fn().mockResolvedValueOnce({})
    hook = renderHook(() => useRemoteRecoil(fn, recoilState))

    const [, , clean] = hook.result.current

    act(() => clean())

    const [state] = hook.result.current

    expect(state.status).toBe(ASYNC_STATUS.INITIAL)
  })
})
