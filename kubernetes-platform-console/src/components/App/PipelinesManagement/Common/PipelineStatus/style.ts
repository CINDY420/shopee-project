import styled from 'styled-components'
import { PIPELINE_STATUS, PIPELINE_STATUS_COLOR } from 'constants/pipeline'

const { success, failure, running, aborted, pending, pausedPendingInput } = PIPELINE_STATUS

const ColorWrapper = styled.span`
  color: ${(props: any) => props.color || PIPELINE_STATUS_COLOR[success]};
  svg {
    margin-right: 5px;
  }
`

export const StyleDiv = styled.div`
  min-width: 140px;
`

export const AbortedWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[aborted]};
`

export const SuccessWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[success]};
`

export const RunningWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[running]};
`

export const PausedWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[pausedPendingInput]};
`

export const FailedWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[failure]};
`

export const PendingWrapper = styled.span`
  color: ${PIPELINE_STATUS_COLOR[pending]};
`

export default ColorWrapper
