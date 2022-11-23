import React from 'react'
import { Progress as AntdProgress } from 'infrad'
import {
  Root,
  PercentWrapper,
} from 'src/components/App/Cluster/ClusterDetail/NodeTable/Progress/style'

interface IProgressProps {
  header: string
  percent: number
}
const Progress: React.FC<IProgressProps> = ({ header, percent }) => (
  <Root>
    <div>{header}</div>
    <AntdProgress percent={percent} showInfo={false} width={100} strokeColor="#A6D4FF" />
    <PercentWrapper>{percent}%</PercentWrapper>
  </Root>
)

export default Progress
