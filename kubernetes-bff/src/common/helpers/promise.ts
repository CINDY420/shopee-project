/**
 * Await all promises, and return all results no matter whether it success or error
 */

export async function promiseWaitAll<T>(promiseList: readonly Promise<T>[]): Promise<(T | Error)[]> {
  return await new Promise((resolve) => {
    const resultList: (T | Error)[] = []
    promiseList.forEach(async (promise) => {
      try {
        const value = await promise
        resultList.push(value)
      } catch (err) {
        resultList.push(err)
      }

      if (resultList.length === promiseList.length) {
        resolve(resultList)
      }
    })
  })
}
