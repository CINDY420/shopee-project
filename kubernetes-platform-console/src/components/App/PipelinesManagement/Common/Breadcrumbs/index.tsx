import * as React from 'react'
import history from 'helpers/history'
import { useRecoilValue } from 'recoil'

import BreadcrumbsBanner from 'components/Common/BreadcrumbsBanner'

import {
  PIPELINES,
  PIPELINE_OVERVIEW,
  CREATE_PIPELINE,
  PIPELINE_DETAIL,
  PIPELINE_RUN,
  EDIT_PIPELINE
} from 'constants/routes/routes'
import { selectedTenant } from 'states/applicationState/tenant'
import {
  selectedPipeline as selectedPipelineState,
  selectedPipelineRun as selectedPipelineRunState
} from 'states/pipelineState'
import { buildTenantName, buildPipelineHistoriesName } from 'constants/routes/name'

enum CrumbType {
  PIPELINE_LIST = 'Pipeline List',
  CREATE_NEW_PIPELINE = 'Create New Pipeline',
  EDIT_PIPELINE = 'Edit Pipeline',
  PIPELINE_DETAIL = 'pipelineDtail',
  PIPELINE_RUN = 'pipelineRun'
}

const routeCrumbsTree = [
  {
    route: PIPELINE_OVERVIEW,
    extendedCrumbs: CrumbType.PIPELINE_LIST,
    children: [
      {
        route: CREATE_PIPELINE,
        extendedCrumbs: CrumbType.CREATE_NEW_PIPELINE
      },
      {
        route: PIPELINE_DETAIL,
        extendedCrumbs: CrumbType.PIPELINE_DETAIL,
        children: [
          {
            route: PIPELINE_RUN,
            extendedCrumbs: CrumbType.PIPELINE_RUN
          },
          {
            route: EDIT_PIPELINE,
            extendedCrumbs: CrumbType.EDIT_PIPELINE
          }
        ]
      }
    ]
  }
]

const crumbLookup = {
  [CrumbType.PIPELINE_LIST]: {
    desc: 'Pipeline List',
    isHideResourceName: true,
    onClick: data => {
      history.push(`${PIPELINES}/${buildTenantName(data.id)}`)
    }
  },
  [CrumbType.CREATE_NEW_PIPELINE]: {
    desc: 'Create New Pipeline',
    isHideResourceName: true,
    onClick: () => {
      history.push(CREATE_PIPELINE)
    }
  },
  [CrumbType.EDIT_PIPELINE]: {
    desc: 'Edit Pipeline',
    isHideResourceName: true,
    onClick: data => {
      history.push(buildPipelineHistoriesName(data.tenantId, data.name))
    }
  },
  [CrumbType.PIPELINE_DETAIL]: {
    desc: 'Pipeline: ',
    onClick: data => {
      history.push(buildPipelineHistoriesName(data.tenantId, data.name))
    }
  },
  [CrumbType.PIPELINE_RUN]: {
    desc: 'Running ID: ',
    nameKey: 'id'
  }
}

const Breadcrumbs: React.FC<{}> = () => {
  const currentSelectedTenant = useRecoilValue(selectedTenant)
  const selectedPipeline = useRecoilValue(selectedPipelineState)
  const selectedPipelineRun = useRecoilValue(selectedPipelineRunState)

  return (
    <BreadcrumbsBanner
      crumbLookup={crumbLookup}
      crumbResourceLookup={{
        [CrumbType.PIPELINE_LIST]: currentSelectedTenant,
        [CrumbType.CREATE_NEW_PIPELINE]: currentSelectedTenant,
        [CrumbType.EDIT_PIPELINE]: {
          tenantId: currentSelectedTenant.id,
          ...selectedPipeline
        },
        [CrumbType.PIPELINE_DETAIL]: {
          tenantId: currentSelectedTenant.id,
          ...selectedPipeline
        },
        [CrumbType.PIPELINE_RUN]: selectedPipelineRun
      }}
      routeCrumbsTree={routeCrumbsTree}
    />
  )
}

export default Breadcrumbs
