import { useRef } from 'react'
import * as R from 'ramda'

export default (fn, comparators) => {
  const prevComparators = useRef(null)
  const shouldExecute = prevComparators.current == null || !R.equals(comparators, prevComparators.current)

  if (!shouldExecute) {
    return
  }

  prevComparators.current = comparators
  fn()
}
