import * as React from 'react'
import { Modal, message, Alert } from 'infrad'

import SDU from './Overview'
import Event from './Event'
import TerminalLog from './TerminalLog'
import DeployConfig from './DeployConfig'

import DetailLayout, { IDetailLayoutProps } from 'components/App/ApplicationsManagement/Common/DetailLayout'
import { selectedApplication } from 'states/applicationState/application'
import { useRecoilValue } from 'recoil'
import { DeleteOutlined, ILink } from 'infra-design-icons'
import { applicationsControllerDeleteApplication } from 'swagger-api/v3/apis/Applications'
import {
  applicationControllerGetApplication,
  applicationControllerGetApplicationServiceName
} from 'swagger-api/v1/apis/Application'
import useAsyncFn from 'hooks/useAsyncFn'
import { buildProjectDetailRoute } from 'constants/routes/routes'
import history from 'helpers/history'
import { getTags } from 'helpers/header'
import { useRemoteRecoil } from 'hooks/useRecoil'
import useInterval from 'hooks/useInterval'
import useUpdateApplicationToTree from 'hooks/tree/useUpdateApplicationToTree'

import accessControl from 'hocs/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'
import HPA from 'components/App/ApplicationsManagement/ApplicationDetail/HPA'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'

enum TABS {
  SDU = 'SDU',
  EVENT = 'Event',
  TERMINAL_LOG = 'Terminal Operation Log',
  DEPLOY_CONFIG = 'Deploy Config',
  HPA = 'HPA'
}

const Application: React.FC<any> = () => {
  const application = useRecoilValue(selectedApplication)
  const updateApplicationToTreeFn = useUpdateApplicationToTree()

  const accessControlContext = React.useContext(AccessControlContext)
  const applicationActions = accessControlContext[RESOURCE_TYPE.APPLICATION] || []
  const canDeleteApplication = applicationActions.includes(RESOURCE_ACTION.Delete)

  const hpaRulesActions = accessControlContext[RESOURCE_TYPE.HPA_RULES] || []
  const { name, tenantId, projectName, enableHpa } = application

  const canViewHpaRules = enableHpa && hpaRulesActions.includes(RESOURCE_ACTION.View)

  const [, deleteApplicationFn] = useAsyncFn(applicationsControllerDeleteApplication)

  const tabs: IDetailLayoutProps['tabs'] = [
    {
      name: TABS.SDU,
      Component: SDU,
      props: {
        application
      }
    },
    {
      name: TABS.EVENT,
      Component: Event,
      props: {
        application
      }
    },
    {
      name: TABS.TERMINAL_LOG,
      Component: TerminalLog,
      props: {
        application
      }
    },
    {
      name: TABS.DEPLOY_CONFIG,
      Component: DeployConfig,
      props: {
        application
      }
    }
  ]

  canViewHpaRules &&
    tabs.push({
      name: TABS.HPA,
      Component: HPA,
      props: {
        application
      }
    })

  const [, selectApplicationFn] = useRemoteRecoil(applicationControllerGetApplication, selectedApplication)

  const refreshApplication = React.useCallback(() => {
    selectApplicationFn({
      tenantId,
      projectName,
      appName: name
    })
  }, [tenantId, name, projectName, selectApplicationFn])

  useInterval(refreshApplication, 5000)

  const [getSpaceLinkState, getSpaceLinkFn] = useAsyncIntervalFn(async () => {
    return await applicationControllerGetApplicationServiceName({
      tenantId,
      projectName,
      appName: name
    })
  })

  const linkToSpace = async () => {
    const { serviceName } = await getSpaceLinkFn()
    const isLive = __SERVER_ENV__ === 'live'
    const prefixServer = isLive ? 'https://space.shopee.io' : 'https://space.test.shopee.io'
    const spaceUrl = prefixServer + `/console/cmdb/detail/${serviceName}/container_view`
    window.open(spaceUrl)
  }

  return (
    <DetailLayout
      title={`Application: ${name}`}
      announcement={
        <Alert
          message='Announcement: Application/SDU management and Deploy Config are gradually migrating to Space. Try it out on Space via “TO SPACE” icon.'
          showIcon
          style={{ marginTop: '16px', marginBottom: '12px' }}
        />
      }
      tags={getTags(application)}
      tabs={tabs}
      buttons={[
        {
          icon: <ILink />,
          text: 'TO SPACE',
          click: linkToSpace,
          loading: getSpaceLinkState.loading
        },
        {
          icon: <DeleteOutlined />,
          text: 'Delete Application',
          visible: canDeleteApplication,
          click: () => {
            Modal.confirm({
              title: `Do you want to delete application ${application.name}`,
              content: 'Related services will be deleted.',
              onOk: () => {
                deleteApplicationFn({
                  tenantId,
                  projectName,
                  name
                }).then(() => {
                  message.success(`Successfully deleted application ${name}`)
                  history.push(buildProjectDetailRoute({ tenantId, projectName }))
                  updateApplicationToTreeFn(tenantId, projectName)
                })
              }
            })
          }
        }
      ]}
    />
  )
}

export default accessControl(Application, PERMISSION_SCOPE.TENANT, [
  RESOURCE_TYPE.APPLICATION,
  RESOURCE_TYPE.DEPLOYMENT,
  RESOURCE_TYPE.APPLICATION_DEPLOY_CONFIG,
  RESOURCE_TYPE.PROJECT,
  RESOURCE_TYPE.HPA_RULES
])
