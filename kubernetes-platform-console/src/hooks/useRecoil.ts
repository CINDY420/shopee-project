import * as React from 'react'
import { useSetRecoilState, RecoilState } from 'recoil'
import { HTTPError } from 'helpers/fetch'
import useMountedState from './useMountedState'

export enum AsyncStatus {
  INITIAL,
  ONGOING,
  FINISHED,
  ERROR
}

export interface IAsyncState<T> {
  status: AsyncStatus
  error?: HTTPError
  value?: T
}

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  IAsyncState<Result>,
  (...args: Args | []) => Promise<Result | undefined>,
  () => void,
  () => void
]

/**
 * Wrap an asynchronous function with the ability of assigning it's return value to recoil
 * @param fn An asynchronous function
 * @param recoilState An object where the return value of fn should be wrote in
 * @return An array [state, callback, clean], in which 'state' is an object records the results of 'callback', 'callback' is the
 * wrapped asynchronous function with the ability of assigning it's return value to recoil, and 'clean' is a function used to initialize state
 */

export function useRemoteRecoil<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result | undefined>,
  recoilState: RecoilState<Result>
): AsyncFn<Result, Args> {
  const [state, setState] = React.useState<IAsyncState<Result>>({ status: AsyncStatus.INITIAL })
  const setRecoilValue = useSetRecoilState(recoilState)
  const getMounted = useMountedState()
  const requestCounter = React.useRef(0)

  const callback = React.useCallback(
    async (...args: Args | []) => {
      requestCounter.current++
      const currentRequestCounter = requestCounter.current

      setState({ ...state, status: AsyncStatus.ONGOING, error: null })
      try {
        const value = await fn(...args)
        if (currentRequestCounter !== requestCounter.current) {
          // prevent race condition
          console.warn('abort legacy request, this will occur when your network is slow')
          return value
        }

        if (getMounted()) {
          setRecoilValue(value)
          setState({ ...state, value, status: AsyncStatus.FINISHED })
        }
        return value
      } catch (error) {
        setState({ ...state, status: AsyncStatus.ERROR, error })
      }
    },
    [fn, getMounted, setRecoilValue, state]
  )

  const clean = React.useCallback(() => {
    setState({ status: AsyncStatus.INITIAL })
  }, [])

  const setSuccess = () => setState({ ...state, value: {} as Result, status: AsyncStatus.FINISHED })

  return [state, callback, clean, setSuccess]
}
