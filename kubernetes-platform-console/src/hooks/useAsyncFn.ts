import { useCallback, useState, DependencyList } from 'react'
import { message } from 'infrad'

import { HTTPError } from 'helpers/fetch'
import useMountedState from './useMountedState'

message.config({
  maxCount: 1
})

export interface IAsyncState<T> {
  loading: boolean
  error?: HTTPError
  value?: T
}

export type AsyncFn<Result = any, Args extends any[] = any[]> = [
  IAsyncState<Result>,
  (...args: Args | []) => Promise<Result | undefined>
]

export interface IConfig<T> {
  errorHandle?: (error: HTTPError, defaultErrorHandle: (error: Error) => any) => any
  deps?: DependencyList
  initialState?: IAsyncState<T>
}

/**
 * Wrap an asynchronous function with errors handling capability
 * @param fn An asynchronous function
 * @param config An optional configuration object used for handling errors
 * @return An array [state, callback], in which 'state' is an object records the results of 'callback', and 'callback' is
 * a wrapped asynchronous function with errors handling capability
 */

export default function useAsyncFn<Result = any, Args extends any[] = any[]> (
  fn: (...args: Args | []) => Promise<Result | undefined>,
  config?: IConfig<Result>
): AsyncFn<Result, Args> {
  const { errorHandle, deps = [], initialState = { loading: false } }: IConfig<Result> = config || {}
  const [state, setState] = useState<IAsyncState<Result>>(initialState)
  const getMounted = useMountedState()

  const callback = useCallback(async (...args: Args | []) => {
    setState({ ...state, loading: true })
    try {
      const value = await fn(...args)
      if (getMounted()) {
        setState({ value, loading: false })
      }
      return value
    } catch (error) {
      const defaultErrorHandle = (error: HTTPError) => message.error(error.message)

      if (getMounted()) {
        setState({ error, loading: false })
      }
      if (errorHandle) {
        errorHandle(error, defaultErrorHandle)
      } else {
        defaultErrorHandle(error)
      }
      // Throw an error so that the externally executed handler(then) will not be called
      throw new Error(error)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [state, callback]
}
