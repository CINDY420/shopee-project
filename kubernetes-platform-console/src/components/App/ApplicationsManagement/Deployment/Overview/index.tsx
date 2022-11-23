import * as React from 'react'

import { IIDeploymentDetailResponseDto } from 'swagger-api/v3/models'

import PodStatus from './PodStatus'
import PodList from './PodList'

import { VerticalDivider } from 'common-styles/divider'
import { RootWrapper } from './style'

interface IOverviewProps {
  deployment: IIDeploymentDetailResponseDto
  clusterId: string
}

const Overview: React.FC<IOverviewProps> = ({ deployment, clusterId }) => {
  const { info } = deployment
  const { phase, podCount } = info || {}

  return (
    <RootWrapper>
      <VerticalDivider size='16px' />
      <PodStatus />
      <VerticalDivider size='16px' />
      {clusterId && phase && (
        <PodList deployment={deployment} phase={phase} clusterId={clusterId} totalPodCount={podCount} />
      )}
    </RootWrapper>
  )
}

export default Overview
