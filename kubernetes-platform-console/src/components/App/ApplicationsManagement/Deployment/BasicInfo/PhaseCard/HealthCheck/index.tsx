import * as React from 'react'

import HealthCheckCard from './HealthCheckCard'
import { Item, CardRoot, CardTitle, CardWrap } from '../style'

interface IProps {
  healthCheck: any
}

const HealthCheck: React.FC<IProps> = ({ healthCheck = {} }) => {
  const { readinessProbe = {}, livenessProbe = {} } = healthCheck

  const hasReadiness = Object.keys(readinessProbe).length
  const hasLiveness = Object.keys(livenessProbe).length
  const isEmpty = !hasReadiness && !hasLiveness

  return (
    <Item alignItems={!isEmpty ? 'flex-start' : ''}>
      <span style={!isEmpty ? { width: '80px' } : {}}>Health Check:</span>
      {!isEmpty ? (
        <CardRoot>
          {hasReadiness ? (
            <CardWrap>
              <CardTitle>Readiness</CardTitle>
              <HealthCheckCard probe={readinessProbe} />
            </CardWrap>
          ) : null}
          {hasLiveness ? (
            <CardWrap>
              <CardTitle>Liveness</CardTitle>
              <HealthCheckCard probe={livenessProbe} />
            </CardWrap>
          ) : null}
        </CardRoot>
      ) : (
        '-'
      )}
    </Item>
  )
}

export default HealthCheck
