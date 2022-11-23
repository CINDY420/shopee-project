import { useCallback, useState, DependencyList, useRef, useEffect } from 'react'
import { message } from 'infrad'

import { HTTPError } from 'helpers/fetch'
import useMountedState from './useMountedState'

const REFRESH_RATE = 5000
message.config({
  maxCount: 1,
})

export interface IAsyncState<TStateValue> {
  loading: boolean
  error?: HTTPError
  value?: TStateValue
}

export type AsyncIntervalFn<TResult = any, TArgs extends any[] = any[]> = [
  IAsyncState<TResult>,
  (...args: TArgs | []) => Promise<TResult | undefined>,
  (startIntervalCallback: boolean) => void,
]

export interface IConfig<TStateValue> {
  errorHandle?: (error: HTTPError, defaultErrorHandle: (error: Error) => any) => any
  deps?: DependencyList
  enableIntervalCallback?: boolean
  refreshRate?: number
  initialState?: IAsyncState<TStateValue>
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
  fn: (...args: TArgs | []) => Promise<TResult | undefined> | undefined,
  config?: IConfig<TResult>,
): AsyncIntervalFn<TResult, TArgs> {
  const {
    errorHandle,
    initialState = { loading: false },
    enableIntervalCallback: isIntervalCallbackEnabled = false,
    refreshRate = REFRESH_RATE,
  }: IConfig<TResult> = config || {}
  const [state, setState] = useState<IAsyncState<TResult>>(initialState)
  // isIntervalCallbackStarted is set to true when the callback needs to be invoked at interval
  const [isIntervalCallbackStarted, setIsIntervalCallbackStarted] = useState(false)
  const prevCallbackArgs = useRef<TArgs | []>([])
  const intervalID = useRef<NodeJS.Timer | null>(null)
  const getMounted = useMountedState()

  const callback = useCallback(
    async (...args: TArgs | []) => {
      if (intervalID.current !== null) {
        clearInterval(intervalID.current)
        intervalID.current = null
        setIsIntervalCallbackStarted(false)
      }

      prevCallbackArgs.current = args

      setState((state) => ({ ...state, loading: true }))
      try {
        const value = await fn(...args)
        if (getMounted()) {
          setState({ value, loading: false })
          if (isIntervalCallbackEnabled) setIsIntervalCallbackStarted(true)
        }
        return value
      } catch (error) {
        errorHandler(error)
      }
    },
    [fn],
  )

  const errorHandler = (error) => {
    const defaultErrorHandle = (error: HTTPError) => message.error(error.message)

    if (getMounted()) setState({ ...state, error, loading: false })

    if (errorHandle) errorHandle(error, defaultErrorHandle)
    else defaultErrorHandle(error)

    // Throw an error so that the externally executed handler(then) will not be called
    throw new Error(error)
  }

  useEffect(() => {
    if (isIntervalCallbackEnabled && isIntervalCallbackStarted)
      intervalID.current = setInterval(async () => {
        try {
          const value = await fn(...prevCallbackArgs.current)
          if (getMounted()) setState((prevState) => ({ ...prevState, value }))

          return value
        } catch (error) {
          errorHandler(error)
        }
      }, refreshRate)
    else if (intervalID.current) {
      clearInterval(intervalID.current)
      intervalID.current = null
    }

    return () => {
      /*
       * when component is unmounted and we still have interval fetching ongoing,
       * we should clean it up
       */
      if (!getMounted() && intervalID.current) clearInterval(intervalID.current)
    }
  }, [isIntervalCallbackStarted, isIntervalCallbackEnabled])

  return [state, callback, setIsIntervalCallbackStarted]
}
