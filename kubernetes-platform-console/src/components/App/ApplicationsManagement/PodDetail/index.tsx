import * as React from 'react'
import DetailLayout, { IDetailLayoutProps } from 'components/App/ApplicationsManagement/Common/DetailLayout'
import Overview from './Overview'
import Event from './Event'
import Logs from './Logs'
import Terminal from './Terminal'
import ProfileModal from '../Deployment/Overview/PodList/ProfileModal'
import Icon, { DeleteOutlined, LineChartOutlined, IOrder } from 'infra-design-icons'
import { message, Modal, Button } from 'infrad'
import history from 'helpers/history'

import { IDeployBaseInfo } from 'api/types/application/deploy'
import { podsControllerDeleteOnePod } from 'swagger-api/v3/apis/Pods'
import { IGetPodDetailResponseDto } from 'swagger-api/v3/models'
import useAsyncFn from 'hooks/useAsyncFn'
import { buildApplicationDetailRoute } from 'constants/routes/routes'

import { useRecoilValue } from 'recoil'
import { selectedPod } from 'states/applicationState/pod'
import { selectedDeployment } from 'states/applicationState/deployment'

import accessControl from 'hocs/accessControl'
import { AccessControlContext } from 'hooks/useAccessControl'
import { PERMISSION_SCOPE, RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import TracingSvg from 'assets/coloredTracing.antd.svg?component'
import { generateLogPlatformLink, generateTracingPlatformLink } from 'helpers/routes'
import { TRACING_ENV_URL_MAP } from 'constants/routes/external'

import { TEST_CLUSTER_NAME } from 'constants/common'

const { confirm } = Modal

const deletePodConfirm = (podName?: string, onOk?: () => any) => {
  confirm({
    title: `Do you want to kill pod "${podName}"?`,
    content: "This operation can't be recovered",
    okText: 'Yes',
    centered: true,
    onOk() {
      if (onOk) {
        onOk()
      }
    }
  })
}

export enum POD_DETAIL_TABS {
  OVERVIEW = 'Overview',
  EVENT = 'Event',
  LOG = 'Log',
  TERMINAL = 'Terminal'
}

const PodDetail: React.FC = () => {
  const [, deleteApplicationPodFn] = useAsyncFn(podsControllerDeleteOnePod)
  const pod: IGetPodDetailResponseDto = useRecoilValue(selectedPod)
  const deployment: IDeployBaseInfo = useRecoilValue(selectedDeployment)

  const accessControlContext = React.useContext(AccessControlContext)
  const podActions = accessControlContext[RESOURCE_TYPE.POD] || []
  const canKillLive = podActions.includes(RESOURCE_ACTION.KillLive)
  const canKillNonLive = podActions.includes(RESOURCE_ACTION.KillNonLive)

  const isLive = pod.environment && pod.environment.toUpperCase() === 'LIVE'
  const hasKillPodPermission = isLive ? canKillLive : canKillNonLive

  const { clusterId, appName, projectName, nodeIP, clusterName, traceId } = pod

  const logPlatformLink = generateLogPlatformLink({ clusterId, appName, projectName, nodeIP })

  const testCluster = clusterName === TEST_CLUSTER_NAME ? 'TEST' : 'LIVE'
  const tracingUrl = TRACING_ENV_URL_MAP[testCluster]
  const tracingPlatformLink = generateTracingPlatformLink({ tracingUrl, traceId })
  const { name: deployName } = deployment

  const [profileModalVisible, setProfileModalVisible] = React.useState(false)

  const tabs: IDetailLayoutProps['tabs'] = [
    {
      name: POD_DETAIL_TABS.OVERVIEW,
      Component: Overview,
      props: {
        pod
      }
    },
    {
      name: POD_DETAIL_TABS.EVENT,
      Component: Event,
      props: {
        pod
      }
    },
    {
      name: POD_DETAIL_TABS.LOG,
      Component: Logs,
      props: {
        pod
      }
    },
    {
      name: POD_DETAIL_TABS.TERMINAL,
      Component: Terminal,
      props: {
        pod
      }
    }
  ]

  const defaultTags = [
    `Env: ${pod.environment}`,
    `CID: ${pod.cid}`,
    `Phase: ${pod.phase}`,
    `Pod IP: ${pod.podIP}`,
    `Node IP: ${pod.nodeIP}`,
    `Cluster: ${pod.clusterName}`
  ]
  const tags = pod?.zoneName ? defaultTags.concat([`Zone: ${pod.zoneName}`]) : defaultTags
  return (
    <>
      <DetailLayout
        state={pod.status}
        title={`Pod: ${pod.name}`}
        tags={tags}
        tabs={tabs}
        CustomButton={() => (
          <Button type='link' onClick={() => setProfileModalVisible(true)} style={{ paddingRight: 0 }}>
            <LineChartOutlined /> Profiling
          </Button>
        )}
        buttons={[
          {
            icon: <IOrder style={{ margin: 'auto', lineHeight: '32px' }} />,
            text: 'Log ',
            click: () => {
              window.open(logPlatformLink)
            }
          },
          {
            icon: <Icon component={TracingSvg} disabled={!traceId} style={{ margin: 'auto', lineHeight: '32px' }} />,
            text: 'Tracing',
            disabled: !traceId,
            click: () => {
              window.open(tracingPlatformLink)
            }
          },
          {
            icon: <DeleteOutlined style={{ margin: 'auto', lineHeight: '32px' }} />,
            text: 'Kill Pod',
            visible: hasKillPodPermission,
            click: () => {
              deletePodConfirm(pod.name, async () => {
                const { tenantId, projectName, appName, name: podName, clusterId } = pod
                await deleteApplicationPodFn({ tenantId, projectName, appName, podName, clusterId })
                history.push(buildApplicationDetailRoute({ tenantId, projectName, applicationName: appName }))
                message.success('Kill success!')
              })
            }
          }
        ]}
      />
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        pod={pod}
        deployName={deployName}
      />
    </>
  )
}

export default accessControl(PodDetail, PERMISSION_SCOPE.TENANT, [RESOURCE_TYPE.POD])
