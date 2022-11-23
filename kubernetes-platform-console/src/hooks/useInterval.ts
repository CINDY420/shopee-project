import * as React from 'react'

/**
 * This hook is use for repeatedly calls a function, with a fixed time interval between each call
 * And will clear this interval when component unmounted
 * @param callback A function to be executed every delay milliseconds.
 * @param interval The time, in milliseconds (thousandths of a second), the timer should delay in between executions of the specified function.
 */
function useInterval (callback: () => void, interval: number) {
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  })

  React.useEffect(() => {
    function tick () {
      savedCallback.current()
    }
    if (interval !== null) {
      const id = setInterval(tick, interval)
      return () => clearInterval(id)
    }
  }, [interval])
}

export default useInterval
