import * as React from 'react'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleFilled
} from 'infra-design-icons'
import { StyledDiv } from 'components/App/RequestAndApproval/Common/TicketStage/style'

import { TICKET_STAGE } from 'constants/requestAndApproval'
import { danger, success, pending, info } from 'constants/colors'

interface TicketStageProps {
  stage: string
}

const TicketStage: React.FC<TicketStageProps> = props => {
  const { stage } = props

  switch (stage) {
    case TICKET_STAGE.PENDING:
      return (
        <StyledDiv style={{ color: pending }}>
          <ClockCircleOutlined /> {stage}
        </StyledDiv>
      )
    case TICKET_STAGE.APPROVED:
      return (
        <StyledDiv style={{ color: success }}>
          <CheckCircleOutlined /> {stage}
        </StyledDiv>
      )
    case TICKET_STAGE.CANCELED:
      return (
        <StyledDiv style={{ color: info }}>
          <ExclamationCircleFilled /> {stage}
        </StyledDiv>
      )
    case TICKET_STAGE.REJECTED:
      return (
        <StyledDiv style={{ color: danger }}>
          <CloseCircleOutlined /> {stage}
        </StyledDiv>
      )
    default:
      return (
        <StyledDiv style={{ color: danger }}>
          <CloseCircleOutlined /> {stage}
        </StyledDiv>
      )
  }
}

export default TicketStage
