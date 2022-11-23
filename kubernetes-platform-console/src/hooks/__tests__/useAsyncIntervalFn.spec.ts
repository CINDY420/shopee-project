import { renderHook, act } from '@testing-library/react-hooks'
import { cleanup, screen } from '@testing-library/react'
import useAsyncIntervalFn from '../useAsyncIntervalFn'

// act related issue: https://github.com/facebook/react/pull/14853

afterEach(() => {
  cleanup()
})

jest.useFakeTimers()

describe('first param: fetch fn', () => {
  it('it should not be invoked when we call hook fn', () => {
    const fetchFn = jest.fn()

    renderHook(() => useAsyncIntervalFn(fetchFn))

    expect(fetchFn).toHaveBeenCalledTimes(0)
  })

  it('it should be invoked when we call the callback fn return from hook', async () => {
    const fetchFn = jest.fn()
    const hook = renderHook(() => useAsyncIntervalFn(fetchFn))
    const [, callback] = hook.result.current

    await act(async () => callback())

    expect(fetchFn).toHaveBeenCalled()
  })
})

describe('second param: config', () => {
  describe('errorHandle', () => {
    it('the default error handler will be called if errorHandle is not defined', async () => {
      const errorMessage = 'some error'
      const errorFetchFn = jest.fn(async () => {
        throw new Error(errorMessage)
      })
      const { result } = renderHook(() => useAsyncIntervalFn(errorFetchFn))
      const [, callback] = result.current

      try {
        await act(async () => callback)
      } catch (e) {
        expect(screen.getByText(errorMessage)).toBeTruthy()
      }
    })

    it('the custom error handler will be called if errorHandle is defined', async () => {
      const errorMessage = 'some error 2'
      const errorFetchFn = jest.fn(async () => {
        throw new Error(errorMessage)
      })
      const errorHandler = jest.fn()
      const hook = renderHook(() => useAsyncIntervalFn(errorFetchFn, { errorHandle: errorHandler }))

      const [, callback] = hook.result.current

      try {
        await act(async () => callback)
      } catch (e) {
        expect(errorHandler).toHaveBeenCalled()
      }
    })
  })

  describe('enableIntervalCallback', () => {
    it('the fetch fn should be called just one time if `enableIntervalCallback` is false', async () => {
      const fetchFn = jest.fn()
      const hook = renderHook(() => useAsyncIntervalFn(fetchFn, { enableIntervalCallback: false }))
      const [, callback] = hook.result.current

      await act(async () => callback())

      expect(fetchFn).toHaveBeenCalledTimes(1)
      jest.advanceTimersByTime(5000)
      expect(fetchFn).toHaveBeenCalledTimes(1)
    })

    it('the fetch fn should be called interval if `enableIntervalCallback` is true', async () => {
      const fetchFn = jest.fn()
      const { result, waitForNextUpdate } = renderHook(() =>
        useAsyncIntervalFn(fetchFn, { enableIntervalCallback: true })
      )
      const [, callback] = result.current

      await act(async () => callback())

      expect(fetchFn).toHaveBeenCalledTimes(1)
      jest.advanceTimersByTime(5000)
      await waitForNextUpdate()
      expect(fetchFn).toHaveBeenCalledTimes(2)
    })
  })
})
