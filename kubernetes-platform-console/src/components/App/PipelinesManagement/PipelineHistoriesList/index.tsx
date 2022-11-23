import React, { useRef, useState, useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import { selectedPipeline } from 'states/pipelineState'
import { selectedTenant } from 'states/applicationState/tenant'
import { PIPELINE_ACTIONS, DISABLED_MIGRATE_ENGINE } from 'constants/pipeline'
import {
  TENANT_ADMIN_ID,
  LIVE_OPERATOR_ID,
  RESOURCE_TYPE,
  RESOURCE_ACTION,
  PERMISSION_SCOPE
} from 'constants/accessControl'
import { freezesControllerGetLastReleaseFreeze } from 'swagger-api/v3/apis/ReleaseFreezes'
import { IReleaseFreezeDetail } from 'api/types/application/pipeline'
import { rbacControllerGetResourcePermissions } from 'swagger-api/v1/apis/Index'

import PipelineHistoriesTable from './PipelineHistoriesTable'
import MovePipelineDrawer from './MovePipelineDrawer'
import MigratePipelineDrawer from './MigratePipelineDrawer'
import { Card } from 'common-styles/cardWrapper'
import { Root, StyledButton } from './style'
import DetailLayout from 'components/Common/DetailLayout'
import Breadcrumbs from '../Common/Breadcrumbs'
import RunPipelineDrawer from 'components/App/PipelinesManagement/Common/RunPipelineDrawer'
import ReleaseFreezeNotice from 'components/App/PipelinesManagement/Common/ReleaseFreezeNotice'

import history from 'helpers/history'
import { AccessControlContext } from 'hooks/useAccessControl'
import accessControl from 'hocs/accessControl'
import { GlobalContext } from 'hocs/useGlobalContext'

const PipelineHistoriesList: React.FC = () => {
  const tenant = useRecoilValue(selectedTenant)
  const pipeline = useRecoilValue(selectedPipeline)
  const { id: tenantId } = tenant
  const { name: pipelineName, env, engine, isCustom } = pipeline || {}
  const refreshTableRef = useRef(null)

  const [isEditDrawerVisible, setEditDrawerVisible] = useState<boolean>(false)
  const [isMigratePipelineDrawerVisible, setMigratePipelineDrawerVisible] = useState<boolean>(false)
  const [isMovePipelineDrawerVisible, setMovePipelineDrawerVisible] = useState<boolean>(false)
  const [isFreezing, setIsFreezing] = useState<boolean>(false)
  const [releaseFreezeDetail, setReleaseFreezeDetail] = useState<IReleaseFreezeDetail>()
  const [globalPipelineActions, setGlobalPipelineActions] = useState<string[]>([])

  const {
    startTime: freezeStartTime = '',
    endTime: freezeEndTime = '',
    env: freezeEnv = '',
    reason: freezeReason = ''
  } = releaseFreezeDetail || {}

  const showEditDrawer = () => setEditDrawerVisible(true)
  const closeEditDrawer = () => setEditDrawerVisible(false)

  const { state } = React.useContext(GlobalContext)
  const { userRoles = [] } = state || {}

  const handleEditPipeline = () => {
    history.push(`/pipelines/tenants/${tenantId}/pipelines/${pipelineName}/edit`)
  }

  const accessControlContext = React.useContext(AccessControlContext)
  const pipelineActions = accessControlContext[RESOURCE_TYPE.PIPELINE] || []
  const canEditPipelineLive = pipelineActions.includes(RESOURCE_ACTION.EditLive)
  const canEditPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.EditNonLive)
  const canRunPipelineLive = pipelineActions.includes(RESOURCE_ACTION.RunLive)
  const canRunPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.RunNonLive)
  const canRebuildPipelineLive = pipelineActions.includes(RESOURCE_ACTION.RebuildLive)
  const canRebuildPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.RebuildNonLive)
  const canAbortPipelineLive = pipelineActions.includes(RESOURCE_ACTION.AbortLive)
  const canAbortPipelineNonLive = pipelineActions.includes(RESOURCE_ACTION.AbortNonLive)
  const canMigratePipeline = pipelineActions.includes(RESOURCE_ACTION.Migrate)
  const canMovePipeline = globalPipelineActions.includes(RESOURCE_ACTION.Move)

  const isLive = env && env.toUpperCase() === 'LIVE'

  const permissionMap = {
    [PIPELINE_ACTIONS.EDIT]: isLive ? canEditPipelineLive : canEditPipelineNonLive,
    [PIPELINE_ACTIONS.RUN_PIPELINE]: isLive ? canRunPipelineLive : canRunPipelineNonLive,
    [PIPELINE_ACTIONS.REBUILD]: isLive ? canRebuildPipelineLive : canRebuildPipelineNonLive,
    [PIPELINE_ACTIONS.ABORT]: isLive ? canAbortPipelineLive : canAbortPipelineNonLive,
    [PIPELINE_ACTIONS.MOVE]: canMovePipeline,
    [PIPELINE_ACTIONS.MIGRATE]: canMigratePipeline
  }

  const getReleaseFreeze = async () => {
    const result = await freezesControllerGetLastReleaseFreeze({ env })
    const { isFreezing, item } = result
    setIsFreezing(isFreezing)
    setReleaseFreezeDetail(item)
  }

  const getGlobalAccessControl = async () => {
    const result = await rbacControllerGetResourcePermissions({
      scope: PERMISSION_SCOPE.GLOBAL,
      resources: [RESOURCE_TYPE.PIPELINE]
    })
    const { Pipeline } = (result as Record<RESOURCE_TYPE, RESOURCE_ACTION[]>) || {}
    setGlobalPipelineActions(Pipeline || [])
  }

  useEffect(() => {
    getReleaseFreeze()
    getGlobalAccessControl()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canRunPipeline = () => {
    const canRun = permissionMap[PIPELINE_ACTIONS.RUN_PIPELINE]
    if (canRun && isFreezing) {
      const role = userRoles.find(role => role.tenantId.toString() === tenantId)
      const { roleId } = role || {}
      if (role && (roleId === TENANT_ADMIN_ID || roleId === LIVE_OPERATOR_ID)) {
        return true
      } else {
        return false
      }
    } else {
      return canRun
    }
  }

  return (
    <>
      <DetailLayout
        breadcrumbs={<Breadcrumbs />}
        title={`Pipeline: ${pipelineName}`}
        tags={[`Engine: ${engine}`]}
        isHeaderWithBottomLine={false}
        ExtraButton={() => (
          <>
            <StyledButton
              onClick={() => setMigratePipelineDrawerVisible(true)}
              disabled={engine === DISABLED_MIGRATE_ENGINE || !permissionMap[PIPELINE_ACTIONS.MIGRATE]}
            >
              Migrate
            </StyledButton>
            <StyledButton
              onClick={() => setMovePipelineDrawerVisible(true)}
              disabled={!permissionMap[PIPELINE_ACTIONS.MOVE]}
            >
              Move
            </StyledButton>
            <StyledButton onClick={handleEditPipeline} disabled={isCustom || !permissionMap[PIPELINE_ACTIONS.EDIT]}>
              Edit
            </StyledButton>
            <StyledButton type='primary' onClick={() => showEditDrawer()} disabled={!canRunPipeline()}>
              Run Pipeline
            </StyledButton>
          </>
        )}
        body={
          <Root>
            <Card height='100%' padding='0 24px' boxShadow='none'>
              {isFreezing && (
                <ReleaseFreezeNotice
                  startTime={freezeStartTime}
                  endTime={freezeEndTime}
                  env={freezeEnv}
                  reason={freezeReason}
                />
              )}
              <PipelineHistoriesTable
                ref={refreshTableRef}
                canRebuild={permissionMap[PIPELINE_ACTIONS.REBUILD]}
                canAbort={permissionMap[PIPELINE_ACTIONS.ABORT]}
                isFreezing={isFreezing}
              />
            </Card>
          </Root>
        }
      />
      <MigratePipelineDrawer
        visible={isMigratePipelineDrawerVisible}
        tenantId={tenantId}
        pipelineName={pipelineName}
        engine={engine}
        onHideDrawer={() => setMigratePipelineDrawerVisible(false)}
      />
      <RunPipelineDrawer
        visible={isEditDrawerVisible}
        onHideDrawer={closeEditDrawer}
        onRefresh={() => refreshTableRef.current.handleRefresh()}
        tenantId={tenantId}
        pipelineName={pipelineName}
      />
      <MovePipelineDrawer
        visible={isMovePipelineDrawerVisible}
        tenantId={tenantId}
        pipelineName={pipelineName}
        onHideDrawer={() => setMovePipelineDrawerVisible(false)}
      />
    </>
  )
}

export default accessControl(PipelineHistoriesList, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.PIPELINE])
