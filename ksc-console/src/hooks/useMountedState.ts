import { useCallback, useEffect, useRef } from 'react'

/**
 * Check the current component whether unmounted
 * @return boolean, if false, the current component is unmounted
 */

export default function useMountedState(): () => boolean {
  const mountedRef = useRef<boolean>(false)
  const getMounted = useCallback(() => mountedRef.current, [])

  useEffect(() => {
    mountedRef.current = true

    return () => {
      mountedRef.current = false
    }
  })

  return getMounted
}
