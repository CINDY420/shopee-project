import { Tag } from 'infrad'
import StatusText from 'src/components/App/Segment/SegmentList/ResourceStatus/StatusText'

const statusColorMapping: Record<string, string> = {
  High: 'error',
  Normal: 'cyan',
  Low: 'warning',
}

interface IResourceStatus {
  status: string
  cpuPercentage: number
  memoryPercentage: number
}

const ResourceStatus: React.FC<IResourceStatus> = ({ status, cpuPercentage, memoryPercentage }) => {
  const color = statusColorMapping[status]

  return (
    <div>
      <Tag color={color}>{status}</Tag>
      <StatusText
        status={status}
        cpuPercentage={cpuPercentage}
        memoryPercentage={memoryPercentage}
      />
    </div>
  )
}

export default ResourceStatus
