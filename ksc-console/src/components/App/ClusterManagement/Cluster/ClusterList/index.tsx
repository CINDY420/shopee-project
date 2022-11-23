import React from 'react'
import { CommonStyledCard } from 'common-styles/card'
import {
  StyledButton,
  StyledRoot,
} from 'components/App/ClusterManagement/Cluster/ClusterList/style'
import TableSearchInput from 'components/Common/TableSearchInput'
import { TABLE_PAGINATION_OPTION } from 'constants/pagination'
import { ColumnsType } from 'infrad/lib/table'
import { IClusterDetailListItem, IListClusterDetailsResponse, IUsage } from 'swagger-api/models'
import {
  clusterControllerAddCluster,
  clusterControllerGetCluster,
  clusterControllerListClustersWithDetail,
  clusterControllerUpdateCluster,
  IClusterControllerListClustersWithDetailParams,
} from 'swagger-api/apis/Cluster'
import useAsyncIntervalFn from 'hooks/useAsyncIntervalFn'
import useAntdTable from 'hooks/useAntdTable'
import { useDebounce } from 'react-use'
import { Link } from 'react-router-dom'
import useGeneratePath from 'hooks/useGeneratePath'
import { CLUSTER } from 'constants/routes/route'
import { MONITOR_BASE_URL } from 'constants/cluster'
import ExpandableTable from 'components/Common/ExpandableTable'
import QuotasTable from 'components/App/ClusterManagement/Cluster/ClusterList/QuotasTable'
import { Col, Form, message, Row } from 'infrad'
import TableCreateButton from 'components/Common/TableCreateButton'
import { PLATFORM_ADMIN_ID } from 'constants/auth'
import useCheckRoles from 'hooks/useCheckRoles'
import CrudModal from 'components/Common/CrudModal'
import ClusterModalForm from 'components/App/ClusterManagement/Common/ClusterModalForm'

const generateMonitorPath = (clusterName: string) => `${MONITOR_BASE_URL}${clusterName}`
const formatMetrics = (data: string | number) => Math.round(Number(data))
const ClusterList = () => {
  const getPath = useGeneratePath()
  const [searchValue, setSearchValue] = React.useState<string>()
  const [isEdit, setIsEdit] = React.useState(false)
  const [isSubmitLoading, setIsSubmitLoading] = React.useState(false)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [updateClusterId, setUpdateClusterId] = React.useState('')
  const [form] = Form.useForm()

  const canCreateCluster = useCheckRoles([
    {
      roleId: PLATFORM_ADMIN_ID,
    },
  ])

  const listClusters = React.useCallback(
    (listClustersParam: IClusterControllerListClustersWithDetailParams) =>
      // list clusters
      clusterControllerListClustersWithDetail({
        ...listClustersParam,
        searchBy: searchValue,
      }),
    [searchValue],
  )

  const [listClustersState, listClustersFn] =
    useAsyncIntervalFn<IListClusterDetailsResponse>(listClusters)
  const { value, loading: isLoadingListClusters } = listClustersState

  const { pagination, handleTableChange, refresh } = useAntdTable({
    fetchFn: listClustersFn,
  })
  const { items: clusterList = [], total = 0 } = value || {}

  useDebounce(
    () => {
      searchValue !== undefined && refresh()
    },
    500,
    [searchValue],
  )

  const handleMonitorButtonClick = (record: IClusterDetailListItem) => {
    const path = generateMonitorPath(record.displayName)
    window.open(path)
  }

  const handleEditButtonClick = async (record: IClusterDetailListItem) => {
    const { clusterId } = record
    const { displayName, kubeconfig, description } = await clusterControllerGetCluster({
      clusterId,
    })
    form.setFieldsValue({
      displayName,
      kubeconfig,
      description,
    })
    setUpdateClusterId(clusterId)
    setIsEdit(true)
    setIsModalVisible(true)
  }

  const columns: ColumnsType<IClusterDetailListItem> = [
    {
      title: 'Cluster',
      dataIndex: 'displayName',
      render: (displayName: string, record) => (
        <Link
          style={{ color: '#2673DD', fontWeight: 500 }}
          to={getPath(CLUSTER, { clusterId: record.clusterId })}
        >
          {displayName}
        </Link>
      ),
    },
    {
      title: 'Assigned / Quota / Total CPU',
      dataIndex: 'cpu',
      render: (cpu: IUsage) => {
        const { assigned = 0, quota = 0, total = 0 } = cpu
        return `${formatMetrics(assigned)} / ${formatMetrics(quota)} / ${formatMetrics(
          total,
        )} Cores`
      },
    },
    {
      title: 'Assigned / Quota / Total Memory',
      dataIndex: 'memory',
      render: (memory: IUsage) => {
        const { assigned = 0, quota = 0, total = 0 } = memory
        return `${formatMetrics(assigned)} / ${formatMetrics(quota)} / ${formatMetrics(total)} GiB`
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (_, record) => (
        <>
          <StyledButton type="link" onClick={() => handleMonitorButtonClick(record)}>
            Monitor
          </StyledButton>
          <StyledButton type="link" onClick={() => handleEditButtonClick(record)}>
            Edit
          </StyledButton>
        </>
      ),
    },
  ]

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value)
  }

  const handleCreateCluster = async () => {
    const formData = await form.validateFields()
    try {
      setIsSubmitLoading(true)
      isEdit
        ? await clusterControllerUpdateCluster({
            clusterId: updateClusterId,
            payload: formData,
          })
        : await clusterControllerAddCluster({ payload: formData })
      handleCancel()
      message.success(`${isEdit ? 'Update' : 'Create'} cluster successed`)
      refresh()
    } catch (error) {
      message.error(error?.message || `${isEdit ? 'Update' : 'Create'} cluster failed`)
    } finally {
      setIsSubmitLoading(false)
    }
  }
  const handleCancel = () => {
    form.resetFields()
    setIsModalVisible(false)
  }

  return (
    <StyledRoot>
      <CommonStyledCard>
        <Row justify="space-between">
          <Col>
            <TableSearchInput
              placeholder="Search Cluster..."
              value={searchValue}
              onChange={(e) => handleSearchValueChange(e.target.value)}
            />
          </Col>
          {canCreateCluster && (
            <Col>
              <TableCreateButton
                title="Create Cluster"
                onClick={() => {
                  setIsEdit(false)
                  setIsModalVisible(true)
                }}
              />
            </Col>
          )}
        </Row>
        <ExpandableTable
          rowKey="clusterId"
          columns={columns}
          dataSource={clusterList}
          loading={isLoadingListClusters}
          onChange={handleTableChange}
          Component={QuotasTable}
          pagination={{
            ...pagination,
            ...TABLE_PAGINATION_OPTION,
            total,
          }}
          scroll={{ x: true }}
        />
        <CrudModal
          title={isEdit ? 'Update Cluster' : 'Create Cluster'}
          width={1024}
          visible={isModalVisible}
          isSubmitLoading={isSubmitLoading}
          onOk={handleCreateCluster}
          onCancel={handleCancel}
          destroyOnClose
        >
          <ClusterModalForm form={form} isEdit={isEdit} />
        </CrudModal>
      </CommonStyledCard>
    </StyledRoot>
  )
}

export default ClusterList
