/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react'
import { message, Button } from 'infrad'
import { DownloadOutlined } from 'infra-design-icons'

import AddClusterDrawer from './AddClusterDrawer'
import ClusterTable from './ClusterTable'
import AddPodFlavorDrawer from './AddPodFlavorDrawer'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useUpdateClusterToTree from 'hooks/tree/useUpdateClusterToTree'

import { clustersControllerListClustersInfo, clustersControllerCreateCluster } from 'swagger-api/v3/apis/Cluster'
import useAsyncFn from 'hooks/useAsyncFn'
import { Card } from 'common-styles/cardWrapper'
import { StyledButton, Title, TitleWrapper } from './style'
import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION, PERMISSION_SCOPE } from 'constants/accessControl'
import accessControl from 'hocs/accessControl'

const Clusters: React.FC = () => {
  const [createClusterState, createClusterFn] = useAsyncFn(clustersControllerCreateCluster)
  const [visible, setVisible] = React.useState(false)
  const updateClusterToTreeFn = useUpdateClusterToTree()

  const [flavorDrawerVisible, setFlavorDrawerVisible] = React.useState(false)

  const accessControlContext = React.useContext(AccessControlContext)
  const clusterActions = accessControlContext[RESOURCE_TYPE.CLUSTER] || []
  const clusterQuotaActions = accessControlContext[RESOURCE_TYPE.CLUSTER_QUOTA] || []

  const canAddCluster = clusterActions.includes(RESOURCE_ACTION.Add)
  const canViewClusterQuota = clusterQuotaActions.includes(RESOURCE_ACTION.View)
  const canEditCluster = clusterActions.includes(RESOURCE_ACTION.Edit)

  const listClustersFnWithResource = React.useCallback(args => {
    const { filterBy } = args || {}

    return clustersControllerListClustersInfo({
      ...args,
      filterBy
    })
  }, [])

  const [listClustersState, listClustersFn] = useAsyncIntervalFn<any>(listClustersFnWithResource)
  const { pagination, handleTableChange, refresh } = useAntdTable({ fetchFn: listClustersFn })

  React.useEffect(() => {
    refresh()
  }, [])

  const openDrawer = () => {
    setVisible(true)
  }

  const closeDrawer = () => {
    setVisible(false)
  }

  const changeLinkToDownload = () => {
    window.open(
      'https://monitoring.i.infra.shopee.io/grafana/d/WLN5KYoGz/k8s-ctlbao-biao?orgId=1&var-prometheus=k8s-ctl-live(New-platform:wip)'
    )
  }

  return (
    <Card height='100%'>
      <TitleWrapper>
        <Title>Cluster Management</Title>
        <div>
          <Button type='link' icon={<DownloadOutlined />} onClick={changeLinkToDownload}>
            Resource Report
          </Button>
          {canEditCluster && (
            <StyledButton size='small' onClick={() => setFlavorDrawerVisible(true)}>
              Pod Flavor Batch Add
            </StyledButton>
          )}
          {canAddCluster && (
            <StyledButton type='primary' size='small' disabled={createClusterState.loading} onClick={openDrawer}>
              Add Cluster
            </StyledButton>
          )}
        </div>
      </TitleWrapper>
      <ClusterTable
        hasViewPermission={canViewClusterQuota}
        listClustersState={listClustersState}
        onTableChange={handleTableChange}
        pagination={pagination}
      />
      <AddClusterDrawer
        closeDrawer={closeDrawer}
        visible={visible}
        onSubmit={createClusterFn}
        submitCallback={() => {
          refresh()
          updateClusterToTreeFn()
          message.success('Add cluster success!')
        }}
      ></AddClusterDrawer>
      <AddPodFlavorDrawer visible={flavorDrawerVisible} onClose={() => setFlavorDrawerVisible(false)} />
    </Card>
  )
}

export default accessControl(Clusters, PERMISSION_SCOPE.GLOBAL, [RESOURCE_TYPE.CLUSTER_QUOTA, RESOURCE_TYPE.CLUSTER])
