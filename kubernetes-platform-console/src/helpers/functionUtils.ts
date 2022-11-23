/**
 * Throttle execution of a function. Especially useful for rate limiting execution of handlers on events like resize and scroll.
 *
 * @param {number} delay A zero-or-greater delay in milliseconds.
 * @param {function} callback A function to be executed after delay milliseconds.
 * @param {boolean} atBegin If true, callback will be executed at the beginning.
 * @param {boolean} isDebounce If true, schedule clear to execute after delay ms. If false, schedule callback to execute after delay ms.
 * @returns {function}
 */
export const throttle = (
  delay: number,
  callback: (...param: any[]) => void,
  atBegin?: boolean,
  isDebounce?: boolean
) => {
  let timeoutID: any
  let doLast = false

  const wrapper = (...args: any[]) => {
    if (atBegin && !timeoutID) {
      callback.call(this, ...args)
    }
    if (isDebounce === true && timeoutID) {
      clearTimeout(timeoutID)
      doLast = true
    }

    if (!timeoutID || doLast) {
      timeoutID = setTimeout(() => {
        callback.call(this, ...args)
        clearTimeout(timeoutID)
        timeoutID = undefined
      }, delay)
    }
  }

  return wrapper
}

/**
 * Debounce execution of a function. Debouncing, unlike throttling, guarantees that a function is only executed a single time, either at the very beginning of a series of calls, or at the very end.
 *
 * @param {number} delay  A zero-or-greater delay in milliseconds
 * @param {function} callback  A function to be executed after delay milliseconds.
 * @param {boolean} atBegin  If true, callback will be executed at the beginning.
 * @returns {function}
 */
export const debounce = (delay: number, callback: (...param: any[]) => void, atBegin?: boolean) => {
  return throttle(delay, callback, atBegin, true)
}

/**
 * debounce(func, [wait=0], [options={}])
 *
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false] Specify invoking on the leading edge of the timeout.
 * @param {cancelObj} [options.cancelObj='canceled'] Specify the error object to be rejected.
 * @returns {Function} Returns the new debounced function.
 */
export const asyncDebounce = (func, wait = 0, { leading = false, cancelObj = 'canceled' } = {}) => {
  let timerId, latestResolve, shouldCancel

  return function (...args: any[]) {
    if (!latestResolve) {
      // The first call since last invocation.
      return new Promise((resolve, reject) => {
        latestResolve = resolve
        if (leading) {
          invokeAtLeading.apply(this, [args, resolve, reject])
        } else {
          timerId = setTimeout(invokeAtTrailing.bind(this, args, resolve, reject), wait)
        }
      })
    }

    shouldCancel = true
    return new Promise((resolve, reject) => {
      latestResolve = resolve
      timerId = setTimeout(invokeAtTrailing.bind(this, args, resolve, reject), wait)
    })
  }

  function invokeAtLeading (args, resolve, reject) {
    func
      .apply(this, args)
      .then(resolve)
      .catch(reject)
    shouldCancel = false
  }

  function invokeAtTrailing (args, resolve, reject) {
    if (shouldCancel && resolve !== latestResolve) {
      reject(cancelObj)
    } else {
      func
        .apply(this, args)
        .then(resolve)
        .catch(reject)
      shouldCancel = false
      clearTimeout(timerId)
      timerId = latestResolve = null
    }
  }
}

export default {
  throttle,
  debounce
}
