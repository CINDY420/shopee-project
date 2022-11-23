import { useCallback, useState, DependencyList, useRef, useEffect } from 'react'
import { message } from 'infrad'

import { HTTPError } from 'helpers/fetch'
import useMountedState from './useMountedState'
import { REFRESH_RATE } from 'constants/time'

export interface IAsyncState<T> {
  loading: boolean
  error?: HTTPError
  value?: T
}

export type AsyncIntervalFn<Result = any, Args extends any[] = any[]> = [
  IAsyncState<Result>,
  (...args: Args | []) => Promise<Result | undefined>,
  (startIntervalCallback: boolean) => void
]

export interface IConfig<T> {
  errorHandle?: (error: HTTPError, defaultErrorHandle: (error: Error) => any) => any
  deps?: DependencyList
  enableIntervalCallback?: boolean
  refreshRate?: number
  initialState?: IAsyncState<T>
}

/**
 * Wrap an asynchronous function with interval triggering capability
 * @param fn An asynchronous function
 * @param config An optional configuration object
 * @return An array [state, callback, setStartIntervalCallback], in which 'state' is an object records the results of 'callback', callback is
 * the wrapped asynchronous function with interval triggering capability, and 'setStartIntervalCallback' is used to setting
 * whether 'callback' should be invoked immediately
 */

export default function useAsyncIntervalFn<Result = any, Args extends any[] = any[]>(
  fn: (...args: Args | []) => Promise<Result | undefined>,
  config?: IConfig<Result>
): AsyncIntervalFn<Result, Args> {
  const {
    errorHandle,
    initialState = { loading: false },
    enableIntervalCallback = false,
    refreshRate = REFRESH_RATE
  }: IConfig<Result> = config || {}
  const [state, setState] = useState<IAsyncState<Result>>(initialState)
  // startIntervalCallback is set to true, when the callback needs to be invoked at interval
  const [startIntervalCallback, setStartIntervalCallback] = useState(false)
  const prevCallbackArgs = useRef<Args | []>([])
  const intervalID = useRef<number | null>(null)
  const getMounted = useMountedState()

  const callback = useCallback(
    async (...args: Args | []) => {
      if (intervalID.current != null) {
        clearInterval(intervalID.current)
        intervalID.current = null
        setStartIntervalCallback(false)
      }

      prevCallbackArgs.current = args

      setState(state => ({ ...state, loading: true }))
      try {
        const value = await fn(...args)
        if (getMounted()) {
          setState({ value, loading: false })
          if (enableIntervalCallback) {
            setStartIntervalCallback(true)
          }
        }
        return value
      } catch (error) {
        errorHandler(error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn]
  )

  const errorHandler = error => {
    const defaultErrorHandle = (error: HTTPError) => message.error(error.message)

    if (getMounted()) {
      // setState({ error, loading: false })
      setState({ ...state, error, loading: false })
    }
    if (errorHandle) {
      errorHandle(error, defaultErrorHandle)
    } else {
      defaultErrorHandle(error)
    }
    // Throw an error so that the externally executed handler(then) will not be called
    throw new Error(error?.stack)
  }

  useEffect(() => {
    if (enableIntervalCallback && startIntervalCallback) {
      intervalID.current = setInterval(async () => {
        try {
          const value = await fn(...prevCallbackArgs.current)
          if (getMounted()) {
            setState(prevState => ({ ...prevState, value }))
          }
          return value
        } catch (error) {
          errorHandler(error)
        }
      }, refreshRate)
    } else {
      if (intervalID.current) {
        clearInterval(intervalID.current)
        intervalID.current = null
      }
    }

    return () => {
      // when component is unmounted and we still have interval fetching ongoing, we should clean it up
      if (!getMounted() && intervalID.current) {
        clearInterval(intervalID.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startIntervalCallback, enableIntervalCallback])

  return [state, callback, setStartIntervalCallback]
}
