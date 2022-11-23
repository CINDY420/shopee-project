import { useCallback, useState, DependencyList, useRef, useEffect } from 'react'
import { message } from 'infrad'

import { HTTPError } from '@space/common-http'
import useMountedState from 'src/hooks/useMountedState'

const DEFAULT_RESRESH_RATE = 5000

export interface IAsyncState<T> {
  loading: boolean
  error?: HTTPError
  value?: T
}

export type AsyncIntervalFn<TResult = any, TArgs extends any[] = any[]> = [
  IAsyncState<TResult>,
  (...args: TArgs | []) => Promise<TResult | undefined>,
  (startIntervalCallback: boolean) => void,
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

export default function useAsyncIntervalFn<TResult = any, TArgs extends any[] = any[]>(
  fn: (...args: TArgs | []) => Promise<TResult | undefined>,
  config?: IConfig<TResult>,
): AsyncIntervalFn<TResult, TArgs> {
  const {
    errorHandle,
    initialState = { loading: false },
    enableIntervalCallback = false,
    refreshRate = DEFAULT_RESRESH_RATE,
  }: IConfig<TResult> = config || {}
  const [state, setState] = useState<IAsyncState<TResult>>(initialState)
  // startIntervalCallback is set to true, when the callback needs to be invoked at interval
  const [startIntervalCallback, setStartIntervalCallback] = useState(false)
  const prevCallbackArgs = useRef<TArgs | []>([])
  const intervalID = useRef<NodeJS.Timer | null>(null)
  const getMounted = useMountedState()

  const callback = useCallback(
    async (...args: TArgs | []) => {
      if (intervalID.current !== null) {
        clearInterval(intervalID.current)
        intervalID.current = null
        setStartIntervalCallback(false)
      }

      prevCallbackArgs.current = args

      setState((state) => ({ ...state, loading: true }))
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
        error instanceof HTTPError && errorHandler(error)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn],
  )

  const errorHandler = (error: HTTPError) => {
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
            setState((prevState) => ({ ...prevState, value }))
          }
          return value
        } catch (error) {
          error instanceof HTTPError && errorHandler(error)
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
