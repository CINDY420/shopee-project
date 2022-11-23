import { QuestionCircleOutlined } from 'infra-design-icons'
import { Tooltip } from 'infrad'
import styled from 'styled-components'

export const StyledTooltip = styled(Tooltip)`
  .ant-tooltip-inner {
    padding: 16px;
  }
  .ant-tooltip-arrow {
    color: #ffffff;
  }
`

export const StyledQuestionCircleOutlined = styled(QuestionCircleOutlined)`
  margin-left: 6px;
  cursor: pointer;
  color: #999999;
`
