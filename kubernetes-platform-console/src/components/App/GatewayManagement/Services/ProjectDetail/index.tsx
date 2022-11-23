import * as React from 'react'
import { useRecoilValue } from 'recoil'

import accessControl from 'hocs/accessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE } from 'constants/accessControl'

import { getTags } from 'helpers/header'
import { selectedGatewayProject } from 'states/gatewayState/project'

import DetailLayout from 'components/App/GatewayManagement/Common/DetailLayout'
import ServerList from '../ServerList'

const ProjectDetail: React.FC = () => {
  const project = useRecoilValue(selectedGatewayProject)

  const { name: projectName } = project || {}
  const formattedProject = { ...project, clusters: project.simpleClusters }

  const AccessControlServerList = accessControl(ServerList, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.SERVICE])

  return (
    <DetailLayout
      title={`Project: ${projectName}`}
      tags={getTags(formattedProject)}
      body={<AccessControlServerList />}
    />
  )
}

export default ProjectDetail
