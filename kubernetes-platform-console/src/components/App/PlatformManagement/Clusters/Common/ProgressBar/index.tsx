import * as React from 'react'
import { Progress } from 'infrad'

// import { STATUS } from 'constants/common'
// import { danger, primary } from 'constants/colors'
import { info } from 'constants/colors'
import { formatFloat } from 'helpers/format'

export interface IProgressBarProps {
  /** The used number of progress */
  used: number
  /** The total capacity of progress */
  capacity: number
  /** The status of progress */
  status?: string
  /** The unit of progress */
  unit?: string
  /** The style of progress */
  style?: any
  /** The format data function for different unit  */
  formatDataFn?: any
}

const ProgressBar: React.FC<IProgressBarProps> = props => {
  const { used, capacity, unit, style } = props

  const percent = Math.round((used / capacity) * 100)
  // const color = status === STATUS.healthy ? primary : danger
  const formatDataFn = props.formatDataFn || formatFloat

  return (
    <div style={style}>
      <div>
        {formatDataFn(used)}/{formatDataFn(capacity)}
        {unit ? ` ${unit}` : ''}
      </div>
      <Progress percent={percent} strokeColor={info} />
    </div>
  )
}

export default ProgressBar
