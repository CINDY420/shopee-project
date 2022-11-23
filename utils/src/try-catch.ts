/**
 * tryCatch return Promise<[TReturn, TError]>
 * Use typescript 4.6 to get a better experience
 *
 * eg: (typescript 4.5 and below)
 *    const [result, error] = await tryCatch(async () => { doSomething() })
 *    if (error) {
 *      doSomethingWithError(error)
 *      return
 *    }
 *    // we can use result safely with double-check
 *    if (result) { doSomethingWithResult(result) }
 *
 * eg: (typescript 4.5 and below without destructuring)
 *    const results = await tryCatch(async () => { doSomething() })
 *    if (results[1]) {
 *      doSomethingWithError(results[1])
 *      return
 *    }
 *    // if without deconstructing, we don't need to check if results[0] is null again
 *    doSomethingWithResult(results[0])
 *
 * eg: (typescript 4.6 and above, with or without destructuring)
 *    const [result, error] = await tryCatch(async () => { doSomething() })
 *    if (error) {
 *      doSomethingWithError(error)
 *      return
 *    }
 *    // we can use result safely without double-check due to typescript is more intelligent after version 4.6
 *    doSomethingWithResult(result)
 *
 * @param {Promise<TReturn>} promise
 */
export async function tryCatch<TReturn, TError = Error>(
  promise: Promise<TReturn> | TReturn,
): Promise<[TReturn, null] | [null, TError]> {
  try {
    const ret = await promise
    return [ret, null]
  } catch (e) {
    return [null, e as TError]
  }
}

export const catching = tryCatch
