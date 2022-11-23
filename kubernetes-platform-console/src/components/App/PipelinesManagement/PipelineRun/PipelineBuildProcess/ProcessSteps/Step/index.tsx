import React, { useEffect, useState } from 'react'
import { Divider } from 'infrad'

import { IStage } from 'api/types/application/pipeline'
import {
  PIPELINE_STEP_STATUS,
  PIPELINE_STEP_ICON_COLOR,
  PIPELINE_STEP_COLOR,
  PIPELINE_STEP_BACKGROUND
} from 'constants/pipeline'

import {
  RightOutlined,
  CloseCircleFilled,
  CheckCircleFilled,
  LoadingOutlined,
  CheckCircleOutlined,
  MinusCircleFilled
} from 'infra-design-icons'
import {
  StyledStep,
  StyledMainDetail,
  StyledStatus,
  StyledDetail,
  StyledName,
  StyledDurationTitle,
  StyledDuration,
  StyledArrow,
  StyledContent,
  StyledSubSteps,
  StyledSubStep,
  StyledSubStepItem
} from './style'
import useDeepEqualEffect from 'hooks/useDeepEqualEffect'

const PIPELINE_STEP_ICONS = {
  [PIPELINE_STEP_STATUS.success]: CheckCircleFilled,
  [PIPELINE_STEP_STATUS.pending]: CheckCircleOutlined,
  [PIPELINE_STEP_STATUS.aborted]: CloseCircleFilled,
  [PIPELINE_STEP_STATUS.failed]: CloseCircleFilled,
  [PIPELINE_STEP_STATUS.inProcess]: LoadingOutlined,
  [PIPELINE_STEP_STATUS.pausedPendingInput]: LoadingOutlined,
  [PIPELINE_STEP_STATUS.notExecuted]: MinusCircleFilled
}

interface IStep extends IStage {
  expanded: boolean
  onStepChange: (jobId: string, stepId: string, stepStatus: string) => void
  onModalVisibleChange: () => void
}

const Step: React.FC<IStep> = ({
  id,
  durationMillis,
  name,
  status,
  steps,
  expanded,
  onStepChange,
  onModalVisibleChange
}) => {
  const { id: firstStepId } = (steps && steps[0]) || {}
  const { status: firstStatus } = (steps && steps[0]) || {}
  const [stepId, setStepId] = useState<string>(firstStepId)
  const [stepStatus, setStepStatus] = useState<string>(firstStatus)

  useEffect(() => {
    if (expanded) {
      onStepChange(id, stepId, stepStatus)
      if (stepStatus === PIPELINE_STEP_STATUS.pausedPendingInput) {
        onModalVisibleChange()
      }
    } else {
      setStepId(firstStepId)
      setStepStatus(firstStatus)
    }
  }, [expanded, onStepChange, id, stepId, firstStepId, stepStatus, firstStatus, onModalVisibleChange])

  useDeepEqualEffect(() => {
    if (steps) {
      const step = steps.find(step => step.id === stepId)
      const { status } = step
      setStepStatus(status)
    }
  }, [steps])

  const getStatusIcon = (status: string) => {
    const ICON = PIPELINE_STEP_ICONS[status] || CheckCircleOutlined
    const color = PIPELINE_STEP_ICON_COLOR[status] || '#999999'
    return <ICON style={{ color }} />
  }

  const renderDuration = (duration: number) => {
    const time = duration / 1000
    const hours = Math.floor(time / 60 / 60)
    const minutes = Math.floor(time / 60) % 60
    const seconds = parseFloat((time % 60).toFixed(2))

    let fullTime = ''
    if (hours > 0) {
      fullTime += hours + 'h '
    }

    if ((hours > 0 && seconds > 0) || minutes > 0) {
      fullTime += minutes + 'mins '
    }

    if (seconds > 0) {
      fullTime += seconds + 's'
    }

    return (
      <div>
        <StyledDurationTitle>Duration: </StyledDurationTitle>
        <StyledDuration>{fullTime || 0 + 's'}</StyledDuration>
      </div>
    )
  }

  const expandSubSteps = () => {
    if (canStatusRun()) {
      onStepChange(id, stepId, stepStatus)
    }
  }

  const canStatusRun = (input: string = status) => {
    if (input !== PIPELINE_STEP_STATUS.pending && input !== PIPELINE_STEP_STATUS.notExecuted) {
      return true
    } else {
      return false
    }
  }

  return (
    <StyledStep>
      <StyledMainDetail onClick={expandSubSteps} cursor={canStatusRun() && !expanded ? 'pointer' : 'default'}>
        <StyledContent>
          <StyledStatus>{getStatusIcon(status)}</StyledStatus>
          <StyledDetail>
            <StyledName color={PIPELINE_STEP_COLOR[status]} fontWeight={expanded ? '500' : '400'}>
              {name}
            </StyledName>
            {canStatusRun() && durationMillis && renderDuration(durationMillis)}
          </StyledDetail>
        </StyledContent>
        {canStatusRun() && (
          <StyledArrow>
            <RightOutlined style={{ color: '#999999' }} />
          </StyledArrow>
        )}
      </StyledMainDetail>
      {expanded && (
        <StyledSubSteps>
          <>
            {steps &&
              steps.map(item => (
                <StyledSubStep key={item.id}>
                  <StyledSubStepItem
                    bgColor={
                      item.id === stepId ? PIPELINE_STEP_BACKGROUND[item.status] || 'transparent' : 'transparent'
                    }
                    onClick={() => {
                      setStepId(item.id)
                      setStepStatus(item.status)
                    }}
                  >
                    <StyledContent>
                      <StyledStatus>{getStatusIcon(item.status)}</StyledStatus>
                      <StyledDetail>
                        <StyledName subStep={true} status={item.status} fontWeight={item.id === stepId ? '500' : '400'}>
                          {item.name}
                        </StyledName>
                        {canStatusRun(item.status) && item.durationMillis && renderDuration(item.durationMillis)}
                      </StyledDetail>
                    </StyledContent>
                  </StyledSubStepItem>
                  <Divider type='vertical' />
                </StyledSubStep>
              ))}
          </>
        </StyledSubSteps>
      )}
    </StyledStep>
  )
}

export default Step
