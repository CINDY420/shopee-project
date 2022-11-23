import { tryCatch } from '@infra/utils'

/**
 * this helper function is use to optional throw error from try catch
 */
export async function tryCatchOptional<TReturn, TError = Error>(
  promise: Promise<TReturn> | TReturn,
  interceptor: (error: TError) => void,
): Promise<[TReturn, null] | [null, TError]> {
  const data = await tryCatch<TReturn, TError>(promise)

  const [, error] = data

  error && interceptor?.(error)

  return data
}
