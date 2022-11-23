import * as React from 'react'
import {
  LoadingOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  ClockCircleFilled,
  ExclamationCircleFilled
} from 'infra-design-icons'

import { PIPELINE_STATUS as STATUS, PIPELINE_STATUS_NAME } from 'constants/pipeline'
import {
  SuccessWrapper,
  RunningWrapper,
  AbortedWrapper,
  FailedWrapper,
  PendingWrapper,
  PausedWrapper,
  StyleDiv
} from './style'

interface IPipelineStatusProps {
  status: string
}

/**
 * HealthyStatus is used for status display
 */
const PipelineStatus: React.FC<IPipelineStatusProps> = props => {
  const { status } = props

  const statusComponents = {
    [STATUS.success]: () => (
      <StyleDiv>
        <SuccessWrapper>
          <CheckCircleFilled />
        </SuccessWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.success]}`}
      </StyleDiv>
    ),
    [STATUS.failure]: () => (
      <StyleDiv>
        <FailedWrapper>
          <CloseCircleFilled />
        </FailedWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.failure]}`}
        {props.children}
      </StyleDiv>
    ),
    [STATUS.unstable]: () => (
      <StyleDiv>
        <FailedWrapper>
          <CloseCircleFilled />
        </FailedWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.unstable]}`}
        {props.children}
      </StyleDiv>
    ),
    [STATUS.notBuilt]: () => (
      <StyleDiv>
        <FailedWrapper>
          <CloseCircleFilled />
        </FailedWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.notBuilt]}`}
        {props.children}
      </StyleDiv>
    ),
    [STATUS.aborted]: () => (
      <StyleDiv>
        <AbortedWrapper>
          <CloseCircleFilled />
        </AbortedWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.aborted]}`}
      </StyleDiv>
    ),
    [STATUS.running]: () => (
      <StyleDiv>
        <RunningWrapper>
          <LoadingOutlined />
        </RunningWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.running]}`}
      </StyleDiv>
    ),
    [STATUS.pausedPendingInput]: () => (
      <StyleDiv>
        <PausedWrapper>
          <ExclamationCircleFilled />
        </PausedWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.pausedPendingInput]}`}
      </StyleDiv>
    ),
    [STATUS.pending]: () => (
      <StyleDiv>
        <PendingWrapper>
          <ClockCircleFilled />
        </PendingWrapper>
        {` ${PIPELINE_STATUS_NAME[STATUS.pending]}`}
      </StyleDiv>
    )
  }
  if (!statusComponents[status]) {
    console.error('Oops! can not find match status for ', status)
    return <FailedWrapper>Undefined Status</FailedWrapper>
  }
  return statusComponents[status]()
}

export default PipelineStatus
