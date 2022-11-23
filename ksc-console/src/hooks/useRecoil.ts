import * as React from 'react'
import { useSetRecoilState, RecoilState } from 'recoil'
import { HTTPError } from 'helpers/fetch'
import useMountedState from './useMountedState'

export enum ASYNC_STATUS {
  INITIAL,
  ONGOING,
  FINISHED,
  ERROR,
}

export interface IAsyncState<TStateValue> {
  status: ASYNC_STATUS
  error?: HTTPError
  value?: TStateValue
}

export type AsyncFn<TResult, TArgs extends any[] = any[]> = [
  IAsyncState<TResult>,
  (...args: TArgs | []) => Promise<TResult | undefined>,
  () => void,
]

/**
 * Wrap an asynchronous function with the ability of assigning it's return value to recoil
 * @param fn An asynchronous function
 * @param recoilState An object where the return value of fn should be wrote in
 * @return An array [state, callback, clean], in which 'state' is an object records the results of 'callback', 'callback' is the
 * wrapped asynchronous function with the ability of assigning it's return value to recoil, and 'clean' is a function used to initialize state
 */

export function useRemoteRecoil<TResult, TArgs extends any[] = any[]>(
  fn: (...args: TArgs | []) => Promise<TResult>,
  recoilState: RecoilState<TResult>,
): AsyncFn<TResult, TArgs> {
  const [state, setState] = React.useState<IAsyncState<TResult>>({ status: ASYNC_STATUS.INITIAL })
  const setRecoilValue = useSetRecoilState(recoilState)
  const getMounted = useMountedState()
  const requestCounter = React.useRef(0)

  const callback = React.useCallback(
    async (...args: TArgs | []) => {
      requestCounter.current++
      const currentRequestCounter = requestCounter.current

      setState({ ...state, status: ASYNC_STATUS.ONGOING, error: undefined })
      try {
        const value = await fn(...args)
        if (currentRequestCounter !== requestCounter.current) {
          // prevent race condition
          console.warn('abort legacy request, this will occur when your network is slow')
          return value
        }

        if (getMounted()) {
          setRecoilValue(value)
          setState({ ...state, value, status: ASYNC_STATUS.FINISHED })
        }
        return value
      } catch (error) {
        setState({ ...state, status: ASYNC_STATUS.ERROR, error })
      }
    },
    [fn, getMounted, setRecoilValue, state],
  )

  const clean = React.useCallback(() => {
    setState({ status: ASYNC_STATUS.INITIAL })
  }, [])

  return [state, callback, clean]
}
