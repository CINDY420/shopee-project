import React from 'react'
import { Card } from 'common-styles/cardWrapper'
// import accessControl from 'hocs/accessControl'
// import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'
import PipelineDetail from './PipelineDetail'

// const AccessControlProjectList = accessControl(PipelineDetail, PERMISSION_SCOPE.TENANT, [
//   RESOURCE_TYPE.PROJECT,
//   RESOURCE_TYPE.PROJECT_QUOTA
// ])

interface IContentProps {
  tenantId: number
}

const Content: React.FC<IContentProps> = ({ tenantId }) => {
  return (
    <Card height='100%' padding='0 24px'>
      {/* <AccessControlProjectList tenantName={tenantName} tenantId={tenantId} onRefreshGroup={onRefreshGroup} /> */}
      <PipelineDetail tenantId={tenantId} />
    </Card>
  )
}

export default Content
