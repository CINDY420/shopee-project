import React from 'react'
import Usage from 'src/components/Common/Usage'
import {
  UsagesWrapper,
  Divider,
  ClusterTableWrapper,
} from 'src/components/App/Segment/SegmentDetail/Overview/style'
import ClusterTable from 'src/components/Common/ClusterTable'

interface IOverviewProps {
  usedCPUPercentage: number
  appliedCPUPercentage: number
  usedCPU: number
  totalCPU: number
  totalMemory: number
  usedMemory: number
  appliedCPU: number
  appliedMemory: number
  usedMemoryPercentage: number
  appliedMemoryPercentage: number
  segmentKey: string
  segmentName: string
  azKey: string
}

const Overview: React.FC<IOverviewProps> = ({
  azKey,
  segmentName,
  usedCPUPercentage,
  usedMemoryPercentage,
  usedCPU,
  totalCPU,
  totalMemory,
  usedMemory,
  appliedCPU,
  appliedMemory,
  appliedCPUPercentage,
  appliedMemoryPercentage,
}) => (
  <div>
    <UsagesWrapper>
      <Usage
        title="CPU Usage"
        used={usedCPU}
        applied={appliedCPU}
        total={totalCPU}
        unit="Cores"
        usedPercentage={usedCPUPercentage}
        appliedPercentage={appliedCPUPercentage}
      />
      <Divider />
      <Usage
        title="Memory Usage"
        used={usedMemory}
        applied={appliedMemory}
        total={totalMemory}
        unit="GiB"
        usedPercentage={usedMemoryPercentage}
        appliedPercentage={appliedMemoryPercentage}
      />
    </UsagesWrapper>
    <ClusterTableWrapper>
      <h3>Cluster List</h3>
      <ClusterTable
        segmentName={segmentName}
        azv2Key={azKey}
        segmentNameFilterDisabled
        azv2KeyFilterDisabled
      />
    </ClusterTableWrapper>
  </div>
)

export default Overview
