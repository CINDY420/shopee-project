import * as React from 'react'
import Overview from './Overview'
import Event from './Event'
import BasicInfo from './BasicInfo'
import HPAManagement from 'components/App/PlatformManagement/Clusters/Detail/HPAManagement'

import { useRecoilValue } from 'recoil'
import { DisconnectOutlined, FormOutlined } from 'infra-design-icons'
import { message, Modal } from 'infrad'

import DetailLayout from 'components/Common/DetailLayout'
import { selectedCluster } from 'states/clusterState'
import Breadcrumbs from '../Common/Breadcrumbs'
import ClusterFormDrawer from './EditClusterDrawer'
import {
  clustersControllerDeleteCluster,
  clustersControllerGetClusterInfo,
  clustersControllerUpdateClusterConfig
} from 'swagger-api/v3/apis/Cluster'

import { CLUSTERS } from 'constants/routes/routes'
import history from 'helpers/history'
import useAsyncFn from 'hooks/useAsyncFn'
import useUpdateClusterToTree from 'hooks/tree/useUpdateClusterToTree'
import { getTags } from 'helpers/header'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'constants/accessControl'
import accessControl from 'hocs/accessControl'

const { confirm } = Modal

enum TABS {
  OVERVIEW = 'Overview',
  EVENT = 'Event',
  BASIC_INFO = 'Basic Info',
  HPA_MANAGEMENT = 'HPA Management'
}

const Cluster: React.FC<any> = () => {
  const cluster = useRecoilValue(selectedCluster)
  const [currentSelectedCluster, setCurrentSelectedCluster] = React.useState(cluster)
  const [visible, setVisible] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const [, deleteClusterFn] = useAsyncFn(clustersControllerDeleteCluster)
  const [, getClusterFn] = useAsyncFn(clustersControllerGetClusterInfo)
  const [, updateClusterFn] = useAsyncFn(clustersControllerUpdateClusterConfig)

  const updateClusterToTreeFn = useUpdateClusterToTree()

  const accessControlContext = React.useContext(AccessControlContext)
  const clusterActions = accessControlContext[RESOURCE_TYPE.CLUSTER] || []
  const hpaControllerActions = accessControlContext[RESOURCE_TYPE.HPA_CONTROLLER] || []

  const canEditCluster = clusterActions.includes(RESOURCE_ACTION.Edit)
  const canUnbindCluster = clusterActions.includes(RESOURCE_ACTION.Unbind)
  const canViewHpaController = hpaControllerActions.includes(RESOURCE_ACTION.View)

  const deleteClusterConfirm = React.useCallback(
    (clusterName?: string, onOk?: () => any) => {
      confirm({
        title: `Do you want to unbind cluster "${clusterName}"?`,
        content: "This operation can't be recovered",
        okText: 'Yes',
        centered: true,
        onOk() {
          if (onOk) {
            onOk()
          }
        },
        onCancel() {
          setIsDeleting(false)
        }
      })
    },
    [setIsDeleting]
  )

  const tabs = React.useMemo(() => {
    const resultTabs: any[] = [
      {
        name: TABS.OVERVIEW,
        Component: Overview,
        props: {
          currentSelectedCluster,
          isDeleting
        }
      },
      {
        name: TABS.EVENT,
        Component: Event,
        props: {
          currentSelectedCluster
        }
      },
      {
        name: TABS.BASIC_INFO,
        Component: BasicInfo
      }
    ]

    canViewHpaController &&
      resultTabs.push({
        name: TABS.HPA_MANAGEMENT,
        Component: HPAManagement,
        props: {
          cluster: currentSelectedCluster.name
        }
      })
    return resultTabs
  }, [canViewHpaController, currentSelectedCluster, isDeleting])

  const closeDrawer = () => {
    setVisible(false)
  }

  const onOpen = () => {
    setVisible(true)
  }

  const updateClusterApi = param => {
    return updateClusterFn({ clusterName: currentSelectedCluster.name, payload: param })
  }

  return (
    <>
      <DetailLayout
        breadcrumbs={<Breadcrumbs />}
        title={`Cluster: ${currentSelectedCluster.name}`}
        tags={getTags(currentSelectedCluster)}
        tabs={tabs}
        buttons={[
          canEditCluster && {
            icon: <FormOutlined />,
            text: 'Edit Cluster',
            click: () => {
              onOpen()
            }
          },
          canUnbindCluster && {
            icon: <DisconnectOutlined />,
            text: 'Unbind Cluster',
            click: () => {
              setIsDeleting(true)
              deleteClusterConfirm(currentSelectedCluster.name, async () => {
                await deleteClusterFn({ clusterName: currentSelectedCluster.name })
                history.push(CLUSTERS)
                message.success('Unbind success!')
                updateClusterToTreeFn()
              })
            }
          }
        ]}
      />
      <ClusterFormDrawer
        closeDrawer={closeDrawer}
        visible={visible}
        clusterName={currentSelectedCluster.name}
        onSubmit={updateClusterApi}
        submitCallback={async () => {
          const newCluster = await getClusterFn({ clusterName: currentSelectedCluster.name })
          setCurrentSelectedCluster(newCluster)
        }}
      ></ClusterFormDrawer>
    </>
  )
}

export default accessControl(Cluster, PERMISSION_SCOPE.GLOBAL, [
  RESOURCE_TYPE.CLUSTER,
  RESOURCE_TYPE.NODE,
  RESOURCE_TYPE.HPA_CONTROLLER
])
