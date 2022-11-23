import React, { useCallback, useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedTenant } from 'states/applicationState/tenant'
import { selectedPipeline, selectedPipelineRun } from 'states/pipelineState'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import { PIPELINE_STATUS, PIPELINE_STATUS_COLOR, PIPELINE_STATUS_NAME, PIPELINE_ACTIONS } from 'constants/pipeline'
import { buildPipelineDetailRoute } from 'constants/routes/routes'

import { freezesControllerGetLastReleaseFreeze } from 'swagger-api/v3/apis/ReleaseFreezes'

import {
  pipelinesControllerRebuildPipelineRun,
  pipelinesControllerAbortPipelineRun,
  pipelinesControllerGetPipelineRunResult,
  pipelinesControllerGetPipelineRunDetail
} from 'swagger-api/v3/apis/Pipelines'

import { IFailedResult } from 'api/types/application/pipeline'

import PipelineBuildParameter from './PipelineBuildParameter'
import PipelineBuildProcess from './PipelineBuildProcess'
import { Card } from 'common-styles/cardWrapper'
import { PauseOutlined, SyncOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from 'infra-design-icons'
import DetailLayout from 'components/Common/DetailLayout'
import Breadcrumbs from '../Common/Breadcrumbs'
import { Button, message, Modal } from 'infrad'
import { StyledAlert } from './style'
import history from 'helpers/history'
import { formatTime } from 'helpers/format'

import useDeepEqualEffect from 'hooks/useDeepEqualEffect'
import { AccessControlContext } from 'hooks/useAccessControl'
import {
  TENANT_ADMIN_ID,
  LIVE_OPERATOR_ID,
  RESOURCE_TYPE,
  RESOURCE_ACTION,
  PERMISSION_SCOPE
} from 'constants/accessControl'
import accessControl from 'hocs/accessControl'
import { GlobalContext } from 'hocs/useGlobalContext'

const { confirm } = Modal

const PipelineRun: React.FC = () => {
  const tenant = useRecoilValue(selectedTenant)
  const pipeline = useRecoilValue(selectedPipeline)
  const pipelineRun = useRecoilValue(selectedPipelineRun)
  const { id: tenantId } = tenant
  const { name: pipelineName, env, engine } = pipeline
  const { id: runId, status: firstStatus } = pipelineRun

  const [lastStatus, setLastStatus] = useState<string>(firstStatus)
  const [lastFailedResult, setLastFailedResult] = useState<IFailedResult>({} as IFailedResult)
  const [endTimeInterval, setEndTimeInterval] = useState<number>(0)
  const [isFreezing, setIsFreezing] = useState<boolean>(false)

  const { state } = React.useContext(GlobalContext)
  const { userRoles = [] } = state || {}

  const accessControlContext = React.useContext(AccessControlContext)
  const pipelineActions = accessControlContext[RESOURCE_TYPE.PIPELINE] || []
  const canRebuildPipelineLive = pipelineActions.includes(RESOURCE_ACTION.RebuildLive)
  const canRebuildPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.RebuildNonLive)
  const canAbortPipelineLive = pipelineActions.includes(RESOURCE_ACTION.AbortLive)
  const canAbortPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.AbortNonLive)

  const isLive = env && env.toUpperCase() === 'LIVE'

  const permissionMap = {
    [PIPELINE_ACTIONS.REBUILD]: isLive ? canRebuildPipelineLive : canRebuildPipelineNonLive,
    [PIPELINE_ACTIONS.ABORT]: isLive ? canAbortPipelineLive : canAbortPipelineNonLive
  }

  const getPipelineRunDetailFnWithResource = useCallback(() => {
    return pipelinesControllerGetPipelineRunDetail({
      tenantId,
      pipelineName,
      runId
    })
  }, [tenantId, pipelineName, runId])

  const [getPipelineRunDetailState, getPipelineRunDetailFn] = useAsyncIntervalFn<any>(
    getPipelineRunDetailFnWithResource,
    {
      enableIntervalCallback:
        lastStatus === PIPELINE_STATUS.running || lastStatus === PIPELINE_STATUS.pausedPendingInput,
      refreshRate: 2000
    }
  )

  const { value } = getPipelineRunDetailState
  const { status, executor, executeTime, endTime, parameters, stages, nextPendingInput } = value || {}

  useEffect(() => {
    let interval = 0
    if (endTime) {
      const date = formatTime(endTime)
      const end = new Date(date).getTime()
      const current = new Date().getTime()
      const gap = current - end
      interval = Math.round(gap / 1000 / 60)
    }
    setEndTimeInterval(interval)
  }, [endTime, lastFailedResult])

  const getPipelineRunFailedResultFnWithResource = useCallback(() => {
    return pipelinesControllerGetPipelineRunResult({
      tenantId,
      pipelineName,
      runId,
      engine
    })
  }, [tenantId, pipelineName, runId, engine])

  const [getPipelineRunFailedResultState, getPipelineRunFailedResultFn] = useAsyncIntervalFn<IFailedResult>(
    getPipelineRunFailedResultFnWithResource,
    {
      enableIntervalCallback:
        lastStatus === PIPELINE_STATUS.failure && endTimeInterval <= 5 && !Object.keys(lastFailedResult).length,
      refreshRate: 5000,
      errorHandle: () => undefined
    }
  )
  const { value: failedResult = {} as IFailedResult } = getPipelineRunFailedResultState

  const getReleaseFreeze = async () => {
    const result = await freezesControllerGetLastReleaseFreeze({ env })
    const { isFreezing } = result
    setIsFreezing(isFreezing)
  }

  useEffect(() => {
    getReleaseFreeze()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canRebuildPipeline = () => {
    const canRebuild = permissionMap[PIPELINE_ACTIONS.REBUILD]
    if (canRebuild && isFreezing) {
      const role = userRoles.find(role => role.tenantId.toString() === tenantId)
      const { roleId } = role || {}
      if (role && (roleId === TENANT_ADMIN_ID || roleId === LIVE_OPERATOR_ID)) {
        return true
      } else {
        return false
      }
    } else {
      return canRebuild
    }
  }

  useEffect(() => {
    setLastStatus(status)
  }, [status])

  useDeepEqualEffect(() => {
    setLastFailedResult(failedResult)
  }, [failedResult])

  useEffect(() => {
    pipelineName && getPipelineRunDetailFn(tenantId, pipelineName, runId)
  }, [getPipelineRunDetailFn, tenantId, pipelineName, runId])

  useEffect(() => {
    lastStatus === PIPELINE_STATUS.failure && getPipelineRunFailedResultFn(tenantId, pipelineName, runId, engine)
  }, [getPipelineRunFailedResultFn, tenantId, pipelineName, runId, engine, lastStatus])

  const handleAbortPipeline = async () => {
    try {
      await pipelinesControllerAbortPipelineRun({ tenantId, pipelineName, runId })
      message.success(`Abort pipeline ${runId} successfully!`)
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const handleRebuildPipeline = async () => {
    try {
      await pipelinesControllerRebuildPipelineRun({ tenantId, pipelineName, runId })
      message.success(`Rebuild pipeline ${runId} successfully!`)
      const url = buildPipelineDetailRoute({ tenantId, pipelineName })
      history.push(url)
    } catch (err) {
      err.message && message.error(err.message)
    }
  }

  const showAbortConfirm = () => {
    confirm({
      title: `Are you sure to abort this pipeline with running ID ${runId}?`,
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk() {
        return handleAbortPipeline()
      }
    })
  }

  return (
    <DetailLayout
      breadcrumbs={<Breadcrumbs />}
      title={
        <>
          <span style={{ color: PIPELINE_STATUS_COLOR[lastStatus] }}>{`[${PIPELINE_STATUS_NAME[lastStatus]}] `}</span>
          {`Running ID: ${runId}`}
        </>
      }
      tags={[]}
      ExtraButton={() =>
        lastStatus === PIPELINE_STATUS.running ||
        lastStatus === PIPELINE_STATUS.pending ||
        lastStatus === PIPELINE_STATUS.pausedPendingInput ? (
          <Button
            type='primary'
            icon={<PauseOutlined />}
            onClick={showAbortConfirm}
            style={{ fontWeight: 500 }}
            disabled={!permissionMap[PIPELINE_ACTIONS.ABORT]}
          >
            Abort
          </Button>
        ) : (
          <Button
            type='primary'
            icon={<SyncOutlined />}
            onClick={() => handleRebuildPipeline()}
            style={{ fontWeight: 500 }}
            disabled={!canRebuildPipeline()}
          >
            Rebuild
          </Button>
        )
      }
      headerExtraMessage={
        lastStatus === PIPELINE_STATUS.failure &&
        Object.keys(lastFailedResult).length && (
          <StyledAlert
            message={`${lastFailedResult?.tips} ${lastFailedResult?.type}: ${lastFailedResult?.msg}.`}
            icon={<CloseCircleOutlined style={{ color: '#F5222D' }} />}
            type='error'
            showIcon
            description={true}
          />
        )
      }
      body={
        <Card height='100%'>
          <PipelineBuildParameter
            executor={executor}
            executeTime={executeTime}
            endTime={endTime}
            parameters={parameters}
          />
          <PipelineBuildProcess stages={stages} nextPendingInput={nextPendingInput} status={lastStatus} />
        </Card>
      }
    />
  )
}

export default accessControl(PipelineRun, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.PIPELINE])
