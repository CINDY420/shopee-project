import React from 'react'
import { Card } from 'common-styles/cardWrapper'
// import accessControl from 'hocs/accessControl'
// import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'
import CreatePipelineDetail from './CreatePipelineDetail'
import { IConfig, ILastRun, IParameterDefinition } from 'api/types/application/pipeline'

// const AccessControlProjectList = accessControl(PipelineDetail, PERMISSION_SCOPE.TENANT, [
//   RESOURCE_TYPE.PROJECT,
//   RESOURCE_TYPE.PROJECT_QUOTA
// ])
interface IContentProps {
  isEdit: boolean
  pipeline?: {
    env: string
    module: string
    name: string
    project: string
    engine: string
    lastRun: ILastRun
    config: IConfig
    parameterDefinitions: IParameterDefinition[]
  }
  tenantId: number
  tenantName: string
}

const PipelineEditor: React.FC<IContentProps> = ({ tenantId, tenantName, pipeline, isEdit }) => {
  return (
    <>
      <Card>
        {/* <AccessControlProjectList tenantName={tenantName} tenantId={tenantId} onRefreshGroup={onRefreshGroup} /> */}
        <CreatePipelineDetail tenantId={tenantId} tenantName={tenantName} pipeline={pipeline} isEdit={isEdit} />
      </Card>
    </>
  )
}

export default PipelineEditor
