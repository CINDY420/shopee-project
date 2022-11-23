import React, { useCallback, useEffect, useState } from 'react'
import { Spin, Result } from 'infrad'
import styled from 'styled-components'

const StyledSpin = styled(Spin)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
const Fetch =
  <TProps extends TFetchResponse, TFetchResponse = any>(
    DecoratedComponent: React.FC<TProps>,
    fetchFn: () => Promise<TFetchResponse>,
  ): React.FC<TProps> =>
  (props) => {
    const [response, setResponse] = useState<TFetchResponse>()
    const [loading, setLoading] = useState(true)
    const [success, setSuccess] = useState(false)

    const fetchData = useCallback(async () => {
      try {
        const response = await fetchFn()
        setResponse(response)
        setSuccess(true)
      } catch (error) {
        setSuccess(false)
      }
      setLoading(false)
    }, [fetchFn])

    useEffect(() => {
      fetchData()
    }, [fetchData])
    if (loading) return <StyledSpin />

    return success ? (
      <DecoratedComponent {...response} {...props} />
    ) : (
      <Result status="500" title="Load page failed!" />
    )
  }

export default Fetch
