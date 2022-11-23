import React, { useCallback, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedTenant } from 'states/applicationState/tenant'
import { selectedPipelineRun, selectedPipeline } from 'states/pipelineState'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { pipelinesControllerGetPipelineRunLog } from 'swagger-api/v3/apis/Pipelines'

import { PIPELINE_STEP_STATUS } from 'constants/pipeline'

import { StyledDiv } from './style'

interface IProcessCode {
  stepId: string
  stepStatus: string
}

const ProcessCode: React.FC<IProcessCode> = ({ stepId, stepStatus }) => {
  const tenant = useRecoilValue(selectedTenant)
  const pipeline = useRecoilValue(selectedPipeline)
  const pipelineRun = useRecoilValue(selectedPipelineRun)
  const { id: tenantId } = tenant
  const { name: pipelineName } = pipeline
  const { id: runId } = pipelineRun

  const getCode = useCallback(() => {
    return pipelinesControllerGetPipelineRunLog({
      tenantId,
      pipelineName,
      runId,
      stepId
    })
  }, [tenantId, pipelineName, runId, stepId])

  const [getPipelineRunCodeState, getPipelineRunCodeFn] = useAsyncIntervalFn<any>(getCode, {
    enableIntervalCallback: stepStatus === PIPELINE_STEP_STATUS.inProcess,
    refreshRate: 2000
  })

  const { value } = getPipelineRunCodeState || {}
  const { text = '' } = value || {}

  useEffect(() => {
    stepId && getPipelineRunCodeFn(stepId)
  }, [getPipelineRunCodeFn, stepId])

  return (
    <StyledDiv
      dangerouslySetInnerHTML={{
        __html: `<pre>${text}</pre>`
      }}
    />
  )
}

export default ProcessCode
