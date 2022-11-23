import * as React from 'react'

import { useRemoteRecoil } from 'hooks/useRecoil'
import { groupsControllerGetDetail } from 'swagger-api/v3/apis/Tenants'
import {
  pipelinesControllerGetPipelineDetail,
  pipelinesControllerGetPipelineRunDetail
} from 'swagger-api/v3/apis/Pipelines'

import PipelineList from './PipelineList'
import CreatePipeline from './CreatePipeline'
import ReleseFreezes from './ReleaseFreezes'
import routeResourceDetectorHOC from 'react-resource-detector'

import { Switch, Redirect, Route } from 'react-router-dom'

import { selectedTenant } from 'states/applicationState/tenant'
import { selectedPipeline, selectedPipelineRun } from 'states/pipelineState'

import {
  PIPELINES,
  CREATE_PIPELINE,
  PIPELINE_OVERVIEW,
  PIPELINE_DETAIL,
  PIPELINE_RUN,
  EDIT_PIPELINE,
  RELEASE_FREEZES
} from 'constants/routes/routes'

import { getMatchResourceHandler } from 'helpers/routes'

import { CommonStyledLayout, CommonStyledContent } from 'common-styles/layout'
import { PIPELINE, CREATEPIPELINE, PIPELINE_HISTORIES, PIPELINE_RUNNING, EDITPIPELINE } from 'constants/routes/name'
import AsyncRoute, { IAsyncRouteProps } from 'components/Common/AsyncRoute'
import SiderMenu from './SiderMenu'

import { Root } from './style'
import EditPipeline from './EditPipeline'

const { lazy } = React

const PipelineHistoriesList = lazy(() => import('./PipelineHistoriesList'))
const PipelineRun = lazy(() => import('./PipelineRun'))

const PipelinesManagement: React.FC & {
  resourceConfigurations?: object
  routeConfigurations?: object
} = () => {
  const [selectedTenantState, selectTenantFn, resetTenantFn] = useRemoteRecoil(
    groupsControllerGetDetail,
    selectedTenant
  )

  const [selectedPipelineState, selectedPipelineFn, resetPipelineState] = useRemoteRecoil(
    pipelinesControllerGetPipelineDetail,
    selectedPipeline
  )

  const [selectPipelineRunState, selectedPipelineRunFn, resetPipelineRunState] = useRemoteRecoil(
    pipelinesControllerGetPipelineRunDetail,
    selectedPipelineRun
  )

  PipelinesManagement.resourceConfigurations = {
    [PIPELINE]: getMatchResourceHandler((matches: IMatches) => {
      selectTenantFn({ tenantId: matches.tenantId })
    }),
    [CREATEPIPELINE]: getMatchResourceHandler((matches: IMatches) => {
      selectTenantFn({ tenantId: matches.tenantId })
    }),
    [EDITPIPELINE]: getMatchResourceHandler((matches: IMatches) => {
      selectedPipelineFn({ tenantId: matches.tenantId, pipelineName: matches.pipelineName })
    }),
    [PIPELINE_HISTORIES]: getMatchResourceHandler((matches: IMatches, name: string) => {
      selectedPipelineFn({ tenantId: matches.tenantId, pipelineName: matches.pipelineName })
    }),
    [PIPELINE_RUNNING]: getMatchResourceHandler((matches: IMatches, name: string) => {
      selectedPipelineRunFn({
        tenantId: matches.tenantId,
        pipelineName: matches.pipelineName,
        runId: matches.pipelineRunningId
      })
    })
  }

  const asyncRoutes: Array<IAsyncRouteProps> = [
    {
      path: PIPELINE_OVERVIEW,
      LazyComponent: PipelineList,
      asyncState: selectedTenantState,
      onUnmounted: resetTenantFn
    },
    {
      path: CREATE_PIPELINE,
      LazyComponent: CreatePipeline,
      asyncState: selectedTenantState,
      onUnmounted: resetTenantFn
    },
    {
      path: EDIT_PIPELINE,
      LazyComponent: EditPipeline,
      asyncState: selectedPipelineState,
      onUnmounted: resetPipelineState
    },
    {
      path: PIPELINE_DETAIL,
      LazyComponent: PipelineHistoriesList,
      asyncState: selectedPipelineState,
      onUnmounted: resetPipelineState
    },
    {
      path: PIPELINE_RUN,
      LazyComponent: PipelineRun,
      asyncState: selectPipelineRunState,
      onUnmounted: resetPipelineRunState
    }
  ]

  return (
    <CommonStyledLayout>
      <SiderMenu />
      <CommonStyledContent>
        <Root>
          <Switch>
            <Route exact path={PIPELINES} component={PipelineList} />
            {asyncRoutes.map(props => (
              <AsyncRoute exact key={props.path as string} {...props} />
            ))}
            <Route exact path={RELEASE_FREEZES} component={ReleseFreezes} />
            <Redirect from='/' to={PIPELINES} />
          </Switch>
        </Root>
      </CommonStyledContent>
    </CommonStyledLayout>
  )
}

// TODO more details on matches key
interface IMatches {
  [key: string]: any
}

PipelinesManagement.routeConfigurations = {
  [PIPELINE_OVERVIEW]: {
    whiteList: [PIPELINE]
  },
  [CREATE_PIPELINE]: {
    whiteList: [CREATEPIPELINE]
  },
  [EDIT_PIPELINE]: {
    whiteList: [PIPELINE, PIPELINE_HISTORIES, EDITPIPELINE]
  },
  [PIPELINE_DETAIL]: {
    whiteList: [PIPELINE, PIPELINE_HISTORIES]
  },
  [PIPELINE_RUN]: {
    whiteList: [PIPELINE, PIPELINE_HISTORIES, PIPELINE_RUNNING]
  }
}

export default routeResourceDetectorHOC(PipelinesManagement, { shouldDetectResourceForAllRoutes: false })
