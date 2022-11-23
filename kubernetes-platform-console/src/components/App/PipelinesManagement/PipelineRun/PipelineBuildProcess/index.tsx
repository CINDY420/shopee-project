import React, { useCallback, useState, useEffect } from 'react'

import { INextPendingInput, IStage } from 'api/types/application/pipeline'
import { PIPELINE_STATUS } from 'constants/pipeline'

import { Spin, Empty } from 'infrad'
import { StyledCard, StyledDiv, ButtonWrapper } from './style'
import ProcessSteps from './ProcessSteps'
import ProcessCode from './ProcessCode'
import { VerticalAlignTopOutlined } from 'infra-design-icons'

interface IPipelineBuildProcess {
  stages: IStage[]
  nextPendingInput: INextPendingInput
  status: string
}

const PipelineBuildProcess: React.FC<IPipelineBuildProcess> = ({ stages, nextPendingInput, status }) => {
  const [jobId, setJobId] = useState<string>()
  const [stepId, setStepId] = useState<string>()
  const [stepStatus, setStepStatus] = useState<string>('')
  const [scrollTarget, setScrollTarget] = useState<HTMLElement>()

  const onStepChange = useCallback((jobId: string, stepId: string, stepStatus: string) => {
    setJobId(jobId)
    setStepId(stepId)
    setStepStatus(stepStatus)
  }, [])

  const handleWindowScroll = (event: any) => {
    window.requestAnimationFrame(() => {
      setScrollTarget(event.target)
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleWindowScroll, true)
    return () => window.removeEventListener('scroll', handleWindowScroll)
  }, [])

  const scrollToTop = () => {
    if (scrollTarget) {
      scrollTarget.scrollTo(0, 0)
    }
  }

  return (
    <StyledCard title='Process'>
      <StyledDiv>
        {stages ? (
          <>
            <ProcessSteps
              onStepChange={onStepChange}
              jobId={jobId}
              stepId={stepId}
              stages={stages}
              nextPendingInput={nextPendingInput}
            />
            <ProcessCode stepId={stepId} stepStatus={stepStatus} />
            <ButtonWrapper onClick={scrollToTop}>
              <VerticalAlignTopOutlined />
            </ButtonWrapper>
          </>
        ) : status === PIPELINE_STATUS.running || status === PIPELINE_STATUS.pending ? (
          <Spin />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </StyledDiv>
    </StyledCard>
  )
}

export default PipelineBuildProcess
