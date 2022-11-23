import * as React from 'react'
import { Button, Modal, message } from 'infrad'
import { SearchOutlined } from 'infra-design-icons'

import useAntdTable from 'hooks/table/useAntdTable'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAsyncFn from 'hooks/useAsyncFn'

import { REFRESH_RATE } from 'constants/time'

import {
  podsControllerDeleteOnePod,
  podsControllerGetDeploymentPods,
  podsControllerBatchDeletePods
} from 'swagger-api/v3/apis/Pods'
import { IIPodListResponse, IGetPodDetailResponseDto } from 'swagger-api/v3/models'
import { IDeployClusterInfoList } from 'api/types/application/deploy'

import { getFilterUrlParam, getFilterItem, filterTypes } from 'helpers/queryParams'
import { throttle } from 'helpers/functionUtils'

import PodTable from 'components/Common/PodTable'
import BatchOperations from 'components/Common/BatchOperations'

import { AccessControlContext } from 'hooks/useAccessControl'
import { RESOURCE_TYPE, RESOURCE_ACTION } from 'constants/accessControl'

import { PodListWrapper, Title, HeaderWrapper, SearchRow, StyledInput } from './style'
import { POD_TABLE_CONTEXT } from 'constants/common'

import ProfileModal from './ProfileModal'

interface IPodListProps {
  deployment: IDeployClusterInfoList
  clusterId: string
  phase: string
  totalPodCount: number
}

const getPodsMap = podList => {
  return podList.reduce((map, pod) => {
    map[pod.name] = pod
    return map
  }, {})
}

const PodList: React.FC<IPodListProps> = ({ deployment, clusterId, phase, totalPodCount }) => {
  const [searchVal, setSearchVal] = React.useState('')
  const [isBatchEditing, setBatchEditing] = React.useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = React.useState([])
  const [isDeletingPod, setIsDeletingPod] = React.useState(false)
  const [selectedProfilePod, setSelectedProfilePod] = React.useState<IGetPodDetailResponseDto>()
  const [profileModalVisible, setProfileModalVisible] = React.useState(false)

  const { tenantId, projectName, appName, name: deployName, env, clusterName } = deployment

  const [, deleteApplicationPodBatchFn] = useAsyncFn(podsControllerBatchDeletePods)
  const [, deleteApplicationPodFn] = useAsyncFn(podsControllerDeleteOnePod)

  const listPodsWithResource = React.useCallback(
    args => {
      const { filterBy } = args || {}

      const extraFilterBy = getFilterUrlParam(
        {
          name: getFilterItem('name', searchVal, filterTypes.contain),
          podIP: getFilterItem('podIP', searchVal, filterTypes.contain)
        },
        { or: true }
      )

      return podsControllerGetDeploymentPods({
        ...args,
        tenantId,
        projectName: projectName,
        clusterId: clusterId,
        appName: appName,
        deployName: deployName,
        phase,
        filterBy: filterBy ? `${filterBy}${extraFilterBy ? `;${extraFilterBy}` : ''}` : extraFilterBy
      })
    },
    [searchVal, tenantId, projectName, clusterId, appName, deployName, phase]
  )

  const [listPodsState, listPodsFn] = useAsyncIntervalFn<IIPodListResponse>(listPodsWithResource, {
    enableIntervalCallback: !isBatchEditing && !isDeletingPod,
    refreshRate: REFRESH_RATE
  })

  const useAntdTableResult = useAntdTable({ fetchFn: listPodsFn, shouldFetchOnMounted: false })
  const { refresh } = useAntdTableResult
  const throttledRefresh = React.useMemo(() => throttle(500, refresh, false, true), [refresh])

  React.useEffect(() => {
    if (clusterId && !isBatchEditing && !isDeletingPod) {
      throttledRefresh()
    }
  }, [searchVal, clusterId, throttledRefresh, isBatchEditing, isDeletingPod, totalPodCount])

  const handleSearchChange = React.useCallback(val => {
    setSearchVal(val)
  }, [])

  const handleCancelBatchKill = () => {
    setBatchEditing(false)
    resetSelectedRowKeys()
  }

  const resetSelectedRowKeys = () => setSelectedRowKeys([])

  const handleBatchKillPod = () => {
    const { tenantId, projectName, appName } = deployment

    Modal.confirm({
      title: 'Kill these pods?',
      content: 'This operation cannot be canceled',
      okText: 'Confirm',
      onOk() {
        const { pods: podList = [] } = listPodsState.value || {}
        const podsMap = getPodsMap(podList)

        const pods = selectedRowKeys.map(name => ({
          name,
          clusterId: podsMap[name] && podsMap[name].clusterId
        }))

        deleteApplicationPodBatchFn({ tenantId, projectName, appName, payload: { pods } }).then(() => {
          message.success('Successfully kill these pods')

          setBatchEditing(false)
          resetSelectedRowKeys()
        })
      }
    })
  }

  const handleDeletePod = (pod: IGetPodDetailResponseDto) => {
    const { tenantId, projectName, appName, name: podName, clusterId } = pod

    setIsDeletingPod(true)
    Modal.confirm({
      title: `Kill pod "${podName}"?`,
      content: 'This operation cannot be canceled',
      okText: 'Confirm',
      onCancel() {
        setIsDeletingPod(false)
      },
      onOk() {
        deleteApplicationPodFn({ tenantId, projectName, appName, podName, clusterId }).then(() => {
          message.success(`Successfully kill pod ${podName}`)

          setIsDeletingPod(false)
        })
      }
    })
  }

  const handleCreatePodProfile = (pod: IGetPodDetailResponseDto) => {
    setSelectedProfilePod(pod)
    setProfileModalVisible(true)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: selectedRowKeys => setSelectedRowKeys(selectedRowKeys)
  }

  const accessControlContext = React.useContext(AccessControlContext)

  const isLive = env && env.toUpperCase() === 'LIVE'
  const podActions = accessControlContext[RESOURCE_TYPE.POD] || []

  const canKillLive = podActions.includes(RESOURCE_ACTION.KillLive)
  const canKillNonLive = podActions.includes(RESOURCE_ACTION.KillNonLive)
  const canBatchKillLive = podActions.includes(RESOURCE_ACTION.BatchKillLive)
  const canBatchKillNonLive = podActions.includes(RESOURCE_ACTION.BatchKillNonLive)

  const canKill = isLive ? canKillLive : canKillNonLive
  const canBatchKill = isLive ? canBatchKillLive : canBatchKillNonLive

  return (
    <>
      <PodListWrapper>
        <HeaderWrapper>
          <Title>Pod List</Title>
          <SearchRow>
            <StyledInput
              allowClear
              value={searchVal}
              placeholder='Search Pod Name/IP...'
              suffix={<SearchOutlined />}
              onChange={event => handleSearchChange(event.target.value)}
              disabled={isBatchEditing}
            />
            {canBatchKill && (
              <Button
                type='primary'
                disabled={isBatchEditing}
                onClick={() => {
                  setBatchEditing(true)
                }}
              >
                Batch-Kill
              </Button>
            )}
          </SearchRow>
        </HeaderWrapper>
        <PodTable
          rowSelection={rowSelection}
          isBatchEditing={isBatchEditing}
          deployName={deployment.name}
          listPodsState={listPodsState}
          useAntdTableResult={useAntdTableResult}
          onDeletePod={handleDeletePod}
          onCreatePodProfile={handleCreatePodProfile}
          hasKillPodPermission={canKill}
          contextType={POD_TABLE_CONTEXT.DEPLOYMENT}
          clusterName={clusterName}
        />
        <BatchOperations
          title='Batch-Kill Pods'
          visible={isBatchEditing}
          selectedCount={selectedRowKeys.length}
          disabled={!selectedRowKeys.length}
          onSubmit={handleBatchKillPod}
          onCancel={handleCancelBatchKill}
        />
      </PodListWrapper>
      <ProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
        pod={selectedProfilePod}
        deployName={deployName}
      />
    </>
  )
}

export default PodList
