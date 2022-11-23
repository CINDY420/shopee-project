import React from 'react'

import { IPipelineParameter } from 'api/types/application/pipeline'

import { formatTime } from 'helpers/format'
import { Descriptions } from 'infrad'
import { StyledDescriptions, StyledTag } from './style'

interface IBuildParameter {
  executor: string
  executeTime: string
  endTime?: string
  parameters: IPipelineParameter[]
}

const PipelineBuildParameter: React.FC<IBuildParameter> = ({ executor, executeTime, endTime, parameters }) => {
  return (
    <StyledDescriptions bordered column={1}>
      <Descriptions.Item label='Paramater'>
        {parameters
          ? parameters.map(item => <StyledTag key={item.name}>{`${item.name}: ${item.value || '-'}`}</StyledTag>)
          : '-'}
      </Descriptions.Item>
      <Descriptions.Item label='Start time~End time'>
        {`${formatTime(executeTime) || '-'}`}
        {endTime && ` - ${formatTime(endTime)}`}
      </Descriptions.Item>
      <Descriptions.Item label='Executor'>{executor || '-'}</Descriptions.Item>
    </StyledDescriptions>
  )
}

export default PipelineBuildParameter
