import {
  StyledText,
  StyledWrapper,
} from 'src/components/App/Segment/SegmentList/ResourceStatus/StatusText/style'

interface IStatusTextProps {
  status: string
  cpuPercentage: number
  memoryPercentage: number
}

const highColor = '#F5222D'
const lowColor = '#FAAD14'

const StatusText: React.FC<IStatusTextProps> = ({ status, cpuPercentage, memoryPercentage }) => {
  if (status === 'Normal') {
    return null
  }
  const color = status === 'High' ? highColor : lowColor
  return (
    <StyledWrapper>
      {cpuPercentage <= 30 ? (
        <StyledText color={color}>{`CPU: ${cpuPercentage}%`}</StyledText>
      ) : null}
      {memoryPercentage <= 30 ? (
        <StyledText color={color}>{`Memory: ${memoryPercentage}`}</StyledText>
      ) : null}
    </StyledWrapper>
  )
}

export default StatusText
