import React from 'react'
import { buildApplicationDetailRoute } from 'constants/routes/routes'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
import { DrawerNoticeWrapper } from './style'
import { IApplication } from 'api/types/application/application'
interface IProps {
  notice: string
  application?: IApplication
  deployConfigEnable?: boolean
}

const DeployConfigNotice: React.FC<IProps> = ({ notice, application, deployConfigEnable }) => {
  const applicationState = application || useRecoilValue(selectedApplication)
  const { tenantId, projectName, name: applicationName } = applicationState || {}
  const applicationDetailRoute = buildApplicationDetailRoute({ tenantId, projectName, applicationName })
  const deployConfigLink = `${location.origin}${applicationDetailRoute}?selectedTab=Deploy Config`

  return (
    <DrawerNoticeWrapper>
      {notice}
      {deployConfigEnable && (
        <a target='_blank' href={deployConfigLink}>
          Deploy Config
        </a>
      )}
    </DrawerNoticeWrapper>
  )
}

export default DeployConfigNotice
