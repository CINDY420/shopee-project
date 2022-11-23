import { Space, Breadcrumb } from 'infrad'
import React from 'react'
import Overview from 'src/components/App/Segment/SegmentDetail/Overview'
import { DetailLayout } from 'src/components/Common/DetailLayout'
import { Models } from 'src/rapper'
import {
  Title,
  MetaWrapper,
  Meta,
  LabelTag,
  Status,
} from 'src/components/App/Segment/SegmentDetail/style'
import { Link } from 'react-router-dom'
import { SEGMENT_LIST } from 'src/constants/routes/routes'
import { ByteToGiB, formatCpu } from 'src/helpers/unit'
import Quota from 'src/components/App/Segment/SegmentDetail/Quota'
import { ITab } from 'src/components/Common/DetailLayout/Tabs'
import { SegmentDetailContext } from 'src/components/App/Segment/SegmentDetail/context'

type SegmentModel = Models['GET/ecpadmin/segments/{segmentId}']['Res']
interface IUsage {
  applied: number
  used: number
  total: number
}

interface ISegmentDetailProps extends SegmentModel {
  cpu: IUsage
  memory: IUsage
  labels: string[]
}

const normalColor = '#13C2C2'
const highColor = '#F5222D'
const lowColor = '#FAAD14'

const SegmentDetail: React.FC<ISegmentDetailProps> = ({
  azKey = '',
  azName,
  name,
  region,
  property,
  type,
  labels,
  status,
  usedCPUPercentage,
  appliedCPUPercentage,
  cpu,
  usedMemoryPercentage,
  appliedMemoryPercentage,
  memory,
  segmentKey = '',
}) => {
  let titleColor = normalColor
  if (status === 'High') {
    titleColor = highColor
  } else if (status === 'Low') {
    titleColor = lowColor
  }

  const breadCrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Link to={SEGMENT_LIST}>Segment List</Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        AZ/Segment: {azName}/{name}
      </Breadcrumb.Item>
    </Breadcrumb>
  )

  const title = (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Title>
        <Status color={titleColor}>[{status}]</Status>AZ/Segment: {`${azName}/${name}`}
      </Title>
      <MetaWrapper>
        <Meta>Region: {region}</Meta>
        <Meta>Property: {property}</Meta>
        <Meta>Type: {type}</Meta>
      </MetaWrapper>
      <MetaWrapper>
        <span>Label:</span>
        {labels.map((label) => (
          <LabelTag key={label}>{label}</LabelTag>
        ))}
      </MetaWrapper>
    </Space>
  )

  const tabs: ITab[] = [
    {
      Component: Overview,
      props: {
        segmentKey,
        segmentName: name,
        azKey,
        usedMemory: ByteToGiB(memory.used),
        usedCPU: formatCpu(cpu.used),
        usedCPUPercentage,
        appliedCPUPercentage,
        usedMemoryPercentage,
        totalCPU: formatCpu(cpu.total),
        totalMemory: ByteToGiB(memory.total),
        appliedCPU: formatCpu(cpu.applied),
        appliedMemory: ByteToGiB(memory.applied),
        appliedMemoryPercentage,
      },
      name: 'Overview',
    },
    {
      Component: Quota,
      name: 'Quota',
    },
  ]

  return (
    <SegmentDetailContext.Provider
      value={{
        azKey,
        azName,
        segmentKey,
        segmentName: name,
      }}
    >
      <DetailLayout breadCrumb={breadCrumb} title={title} tabs={tabs} />
    </SegmentDetailContext.Provider>
  )
}

export default SegmentDetail
