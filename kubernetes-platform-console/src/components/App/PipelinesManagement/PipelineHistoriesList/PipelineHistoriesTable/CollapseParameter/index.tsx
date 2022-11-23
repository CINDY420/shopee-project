import React, { useState } from 'react'
import { IPipelineParameter } from 'api/types/application/pipeline'

import {
  StyleDiv,
  ParameterDiv,
  ParameterName,
  ParameterValue,
  CollapseButton,
  CollapseDiv,
  CollapseSpan
} from './style'
import { DownOutlined, UpOutlined } from 'infra-design-icons'

interface ICollapseParameter {
  parameters: IPipelineParameter[]
}

const CollapseParameter: React.FC<ICollapseParameter> = ({ parameters }) => {
  const [expanded, setExpanded] = useState<boolean>(false)

  const renderParameter = (key, value) => {
    const Component = expanded ? CollapseDiv : CollapseSpan
    const ValueComponent = expanded ? ParameterValue : 'span'

    return (
      <Component key={key}>
        <ParameterName>{key}</ParameterName>
        <ValueComponent>{value.toString() || '-'}</ValueComponent>
      </Component>
    )
  }

  return (
    <StyleDiv>
      <ParameterDiv>{parameters && parameters.map(item => renderParameter(item.name, item.value))}</ParameterDiv>
      <CollapseButton type='link' onClick={() => setExpanded(!expanded)}>
        {expanded ? (
          <>
            Collapse <UpOutlined />
          </>
        ) : (
          <>
            More <DownOutlined />
          </>
        )}
      </CollapseButton>
    </StyleDiv>
  )
}

export default CollapseParameter
